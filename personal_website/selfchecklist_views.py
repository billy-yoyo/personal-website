from django.shortcuts import render
import markdown

class Link:
  def __init__(self, id, content, label):
    self.id = id
    self.content = markdown.markdown(content)
    self.label = markdown.markdown(label)

class Section:
  def __init__(self, title, links):
    self.title = title
    self.links = links

bank_card = """
Why apply for a bank card?

You will probably need to transfer money from your home country and this is much easier if you have a UK bank account. You will also find it more convenient when paying your tuition fees.

How to apply for a bank card?

  * Get your proof of identity (Passport or BRP)</li>
  * Get some proof of address (Usually this will be a bank latter from your university, you can download it [here](/))</li>
  * Book an in-person appointment with the bank you are interested in (by walk-in or sending an email; or apply for an online back account by using your phone)</li>
  * Wait to receive your bank card (normally within 1 month)</li>


""".strip()

sections = [
  Section("🎓 Study in the UK", [
    Link(
      "independant-study",
      "Some content",
      "You need to study independently, which means you need to **explore your own study topic, seek help when you need, organize your time and tasks**"
    ),
    Link(
      "intercultural-interactions",
      "Some content",
      "You will need to get along with your supervisors and classmates from different cultural backgrouns. More tips on **intercultural interactions**."
    ),
    Link(
      "assessment-system",
      "Some content",
      "The assessment system at the university."
    ),
  ]),
  Section("🏠 Living in the UK", [
    Link(
      "banks",
      bank_card,
      "Preparing for your bank card application"
    ),
    Link(
      "gp",
      "Some content",
      "Preparing for your GPs (General Practitioners) registration"
    ),
    Link(
      "student-societies",
      "Some content",
      "Get ready to make some friends! You can choose to registrate on i-bubble or join some Student societies."
    ),
    Link(
      "culture-difference",
      "Some content",
      "There will be some cultural differences"
    )
  ])
]

def home(request):
  

  return render(request, "selfchecklist/home.html", {
    "sections": sections,
    "lang": "en"
  })

