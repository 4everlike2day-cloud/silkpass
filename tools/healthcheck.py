"""Ежедневная проверка welcome2.uz и отчёт в Telegram.
Запускается из GitHub Actions (.github/workflows/healthcheck.yml), можно и вручную:
  TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... python tools/healthcheck.py
Без переменных Telegram просто печатает отчёт.
"""
import datetime as dt, json, os, re, socket, ssl, time, urllib.request, urllib.error

SITE = os.environ.get('SITE_URL', 'https://welcome2.uz')
# Страницы: адрес, текст, который обязательно должен быть на странице
PAGES = [
    ('/', 'Welcome 2 UZ'), ('/ru', 'Welcome 2 UZ'), ('/uz', 'Welcome 2 UZ'),
    # адреса из QR-кодов паспорта — самые важные
    ('/tashkent', 'Tashkent'), ('/samarkand', 'Samarkand'), ('/bukhara', 'Bukhara'), ('/khiva', 'Khiva'),
    ('/how-it-works', 'Welcome 2 UZ'), ('/reward', 'Welcome 2 UZ'),
]
# Обработчики форм: шлём пустой POST. Живая функция отвечает 400 (пустая форма) и ничего не отправляет в Telegram.
# 404 или 5xx — функция пропала или сломалась
APIS = ['/api/lead', '/api/route-complete']
# Сроки: (название, дата окончания ГГГГ-ММ-ДД). Даты можно переопределить переменными GitHub.
DEADLINES = [
    ('Домен welcome2.uz', os.environ.get('DOMAIN_WELCOME2_UNTIL') or '2027-10-08'),
    ('Домен silkpass.uz', os.environ.get('DOMAIN_SILKPASS_UNTIL') or '2027-10-08'),
    ('Токен GitHub для вебхука Sanity', os.environ.get('SANITY_WEBHOOK_TOKEN_UNTIL') or ''),
]
WARN_DAYS = 45
TZ = dt.timezone(dt.timedelta(hours=5))


def fetch(path, method='GET'):
    req = urllib.request.Request(SITE + path, method=method, data=b'' if method == 'POST' else None,
                                 headers={'User-Agent': 'welcome2-healthcheck'})
    t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode('utf-8', 'replace'), time.time() - t
    except urllib.error.HTTPError as e:
        return e.code, '', time.time() - t
    except Exception as e:
        return 0, str(e), time.time() - t


def ssl_days(host='welcome2.uz'):
    ctx = ssl.create_default_context()
    with socket.create_connection((host, 443), timeout=15) as s, ctx.wrap_socket(s, server_hostname=host) as ss:
        exp = dt.datetime.strptime(ss.getpeercert()['notAfter'], '%b %d %H:%M:%S %Y %Z')
    return (exp.replace(tzinfo=dt.timezone.utc) - dt.datetime.now(dt.timezone.utc)).days


def main():
    problems, lines = [], []
    slow = []
    version = '?'
    print('Проверка', SITE)
    for path, must in PAGES:
        code, body, sec = fetch(path)
        print(f'  {path:<16} код {code}  {sec:.1f} с  текст «{must}»: {"есть" if must in body else "НЕТ"}')
        if code != 200 or must not in body:
            problems.append(f'❌ {path} — код {code}' + ('' if code != 200 else ', нет нужного текста'))
        elif sec > 3:
            slow.append(f'{path} {sec:.1f} с')
        if path == '/' and code == 200:
            m = re.search(r'class="version">v(?:<!-- -->)?([\d.]+)', body)
            version = m.group(1) if m else '?'
    for path in APIS:
        code, _, _ = fetch(path, 'POST')
        print(f'  {path:<16} код {code}')
        if code != 400:
            problems.append(f'❌ форма {path} — код {code}')
    try:
        d = ssl_days()
        if d < 14:
            problems.append(f'⚠️ SSL-сертификат истекает через {d} дн.')
    except Exception as e:
        problems.append(f'❌ SSL не проверен: {e}')
    today = dt.datetime.now(TZ).date()
    for name, until in DEADLINES:
        if not until:
            continue
        left = (dt.date.fromisoformat(until) - today).days
        if left <= WARN_DAYS:
            problems.append(f'⏰ {name}: осталось {left} дн. (до {until})')

    errors = any(p.startswith('❌') for p in problems)
    head = '🔴 welcome2.uz: есть проблемы' if errors else ('🟡 welcome2.uz работает, есть напоминания' if problems else '🟢 welcome2.uz работает')
    lines.append(f'<b>{head}</b> · {today.strftime("%d.%m.%Y")}')
    lines.append(f'Страниц проверено: {len(PAGES)}, формы: {len(APIS)}, версия сайта: {version}')
    if slow:
        lines.append('🐢 Медленно: ' + ', '.join(slow))
    lines += problems
    text = '\n'.join(lines)
    print(text)

    token, chat = os.environ.get('TELEGRAM_BOT_TOKEN'), os.environ.get('TELEGRAM_CHAT_ID')
    if token and chat:
        data = json.dumps({'chat_id': chat, 'text': text, 'parse_mode': 'HTML', 'disable_web_page_preview': True}).encode()
        try:
            urllib.request.urlopen(urllib.request.Request(f'https://api.telegram.org/bot{token}/sendMessage', data=data,
                                                          headers={'Content-Type': 'application/json'}), timeout=20)
            print('Отчёт отправлен в Telegram')
        except urllib.error.HTTPError as e:
            print('Telegram не принял отчёт:', e.code, e.read().decode('utf-8', 'replace'), '| проверьте TELEGRAM_CHAT_ID в секретах GitHub (для группы он начинается с минуса)')
            raise SystemExit(1)
    else:
        print('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы: отчёт только в логе')
    # Чтобы в GitHub Actions проверка тоже была красной при проблемах
    if any(p.startswith('❌') for p in problems):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
