import fitz  # PyMuPDF
import os


def convert_pdf_to_text(pdf_name):
    # Pfade definieren basierend auf deiner Struktur
    input_path = os.path.join("..", "knowledge_base_pdf", pdf_name)
    output_folder = "output_text"

    # Ordner für Ergebnisse erstellen, falls er nicht existiert
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    output_path = os.path.join(output_folder, pdf_name.replace(".pdf", ".txt"))

    print(f"Lese Datei: {input_path}...")

    try:
        doc = fitz.open(input_path)
        full_text = ""

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            full_text += f"\n--- SEITE {page_num + 1} ---\n"
            full_text += page.get_text()

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)

        print(f"Erfolg! Text gespeichert in: {output_path}")

    except Exception as e:
        print(f"Fehler: {e}")


# Wir starten mit dem PMO Practice Guide
convert_pdf_to_text("pmo_practiceguide_eng.pdf")
