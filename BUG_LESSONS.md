# Уроки

- **launchd не читает Desktop.** `python3 serve.py` из `~/Desktop/...` падает с «Operation not permitted» (TCC).
  Рабочая копия живёт в `~/Library/Application Support/saltykov-card`, туда копирует `push.sh`.
- **Grid с `::before` и голым текстом.** `li { display:grid; grid-template-columns: 40px 1fr }` с `<b>` и текстовым узлом
  раскладывает каждый анонимный кусок в свою ячейку — текст по слову в строке. Оборачивать содержимое в `<span>`.
- **Sticky hero выше окна режет кнопки.** На высоте < 820px и на мобильном hero становится `position: relative`,
  параллакс включается только когда hero действительно sticky.
- **Футер под sticky hero.** Всё после `.sheet` должно иметь `position: relative; z-index: 2`, иначе просвечивает первый экран.
