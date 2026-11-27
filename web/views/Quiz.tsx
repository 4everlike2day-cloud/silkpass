import Quiz, {type QuizLang} from '@/components/Quiz'

// Викторина «Насколько ты знаешь Узбекистан?»: welcome2.uz/quiz и welcome2.uz/ru/quiz.
// Узбекской версии пока нет: вопросы на UZ появятся после проверки носителем языка.
const META = {
  en: {title: 'Quiz: how well do you know Uzbekistan?', description: '10 questions about cities, history, food and traditions of Uzbekistan. Two modes, Tourist and Local, and a result to share in your story.'},
  ru: {title: 'Викторина: насколько ты знаешь Узбекистан?', description: '10 вопросов о городах, истории, еде и традициях Узбекистана. Два режима, «Турист» и «Местный», и результат, которым можно поделиться в сторис.'},
}

export const quizMeta = (lang: QuizLang) => ({
  ...META[lang],
  openGraph: {...META[lang], images: [`/quiz/story/${lang}-tourist-10.jpg`]},
  alternates: {languages: {en: '/quiz', ru: '/ru/quiz'}},
})

export default function QuizPage({lang}: {lang: QuizLang}) {
  return (
    <section className="quiz-page">
      <div className="wrap">
        <Quiz lang={lang} />
      </div>
    </section>
  )
}
