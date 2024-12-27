import { useLanguageStore, translations } from "@/stores/languageStore"

const Expenses = () => {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t.expenses}</h1>
      <div className="grid gap-6">
        {/* سيتم إضافة محتوى صفحة المصروفات لاحقاً */}
      </div>
    </div>
  )
}

export default Expenses