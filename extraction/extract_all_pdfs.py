import fitz  # PyMuPDF
import os


def convert_all_pdfs():
    # Pfade definieren
    # Wir gehen davon aus, dass das Skript im Ordner 'extraction' liegt
    input_folder = os.path.join("..", "knowledge_base_pdf")
    output_folder = "output_text"

    # 1. Prüfen, ob der PDF-Ordner existiert
    if not os.path.exists(input_folder):
        print(f"Fehler: Der Ordner {input_folder} wurde nicht gefunden!")
        return

    # 2. Output-Ordner erstellen
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"Ordner '{output_folder}' wurde erstellt.")

    # 3. Alle Dateien im PDF-Ordner auflisten
    files = [f for f in os.listdir(input_folder) if f.lower().endswith(".pdf")]

    if not files:
        print("Keine PDF-Dateien im Ordner gefunden.")
        return

    print(f"Gefundene Dateien ({len(files)}): {files}")

    # 4. Jede Datei verarbeiten
    for pdf_name in files:
        input_path = os.path.join(input_folder, pdf_name)
        output_path = os.path.join(output_folder, pdf_name.replace(".pdf", ".txt"))

        print(f"--- Verarbeite: {pdf_name} ---")

        try:
            doc = fitz.open(input_path)
            full_text = ""

            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Text extrahieren und Seitenmarker hinzufügen
                full_text += f"\n\n--- SOURCE: {pdf_name} | PAGE {page_num + 1} ---\n"
                full_text += page.get_text()

            with open(output_path, "w", encoding="utf-8") as f:
                f.write(full_text)

            print(f"Erfolgreich extrahiert: {output_path}")

        except Exception as e:
            print(f"Fehler bei Datei {pdf_name}: {e}")

    print("\nAlle Dateien wurden verarbeitet!")


if __name__ == "__main__":
    convert_all_pdfs()
