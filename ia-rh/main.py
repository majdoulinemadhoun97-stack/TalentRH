from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from pypdf import PdfReader
from io import BytesIO
import re


app = FastAPI(
    title="TalentRH - API IA",
    description="API pour l'analyse intelligente des CV",
    version="1.0"
)


# --------------------------------------------------
# Route de test
# --------------------------------------------------

@app.get("/")
def accueil():
    return {
        "message": "API IA TalentRH fonctionne"
    }


# --------------------------------------------------
# Extraction des compétences du CV
# --------------------------------------------------

def extraire_competences(texte):

    competences_connues = [
        "Python",
        "Java",
        "JavaScript",
        "HTML",
        "CSS",
        "PHP",
        "MySQL",
        "SQL",
        "Spring Boot",
        "Spring Data JPA",
        "Next.js",
        "React",
        "Tailwind CSS",
        "OpenCV",
        "KNN",
        "Machine Learning",
        "Git",
        "GitHub",
        "Power BI",
        "Odoo"
    ]

    texte_minuscule = texte.lower()

    competences_trouvees = []

    for competence in competences_connues:

        competence_minuscule = competence.lower()

        # Créer un motif pour chercher
        # la compétence comme terme complet
        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(competence_minuscule)
            + r"(?![a-zA-Z0-9])"
        )

        # Vérifier si la compétence existe dans le CV
        if re.search(pattern, texte_minuscule):
            competences_trouvees.append(competence)

    return competences_trouvees


# --------------------------------------------------
# Calcul du score de compatibilité
# --------------------------------------------------

def calculer_score_competences(
    competences_cv,
    competences_offre
):

    # Transformer les compétences de l'offre en liste
    competences_requises = [
        competence.strip().lower()
        for competence in competences_offre.split(",")
        if competence.strip()
    ]

    # Mettre les compétences du CV en minuscules
    competences_cv_normalisees = [
        competence.lower()
        for competence in competences_cv
    ]

    competences_correspondantes = []
    competences_manquantes = []

    # Comparer CV et offre
    for competence in competences_requises:

        if competence in competences_cv_normalisees:

            competences_correspondantes.append(
                competence
            )

        else:

            competences_manquantes.append(
                competence
            )

    # Calcul du score
    if len(competences_requises) == 0:

        score = 0

    else:

        score = (
            len(competences_correspondantes)
            / len(competences_requises)
        ) * 100

    return {
        "score": round(score, 2),
        "competences_correspondantes":
            competences_correspondantes,
        "competences_manquantes":
            competences_manquantes
    }


# --------------------------------------------------
# Analyse du CV
# --------------------------------------------------

@app.post("/analyser-cv")
async def analyser_cv(
    cv: UploadFile = File(...),
    competences_offre: str = Form(...)
):

    # Vérifier que le fichier est un PDF
    if cv.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Le fichier doit être au format PDF"
        )

    # Lire le fichier PDF
    contenu = await cv.read()

    # Ouvrir le PDF
    lecteur = PdfReader(
        BytesIO(contenu)
    )

    # Extraire le texte
    texte = ""

    for page in lecteur.pages:

        texte_page = page.extract_text()

        if texte_page:

            texte += texte_page + "\n"

    # Extraire les compétences du CV
    competences = extraire_competences(
        texte
    )

    # Comparer les compétences du CV
    # avec celles de l'offre
    resultat_matching = (
        calculer_score_competences(
            competences,
            competences_offre
        )
    )

    # Retourner le résultat
    return {

        "nom_fichier":
            cv.filename,

        "competences_cv":
            competences,

        "competences_offre":
            competences_offre,

        "score_compatibilite":
            resultat_matching["score"],

        "competences_correspondantes":
            resultat_matching[
                "competences_correspondantes"
            ],

        "competences_manquantes":
            resultat_matching[
                "competences_manquantes"
            ]
    }