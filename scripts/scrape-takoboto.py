import os
from os import read
import re
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
import json
import argparse
import re

details_path = os.path.dirname(__file__) + ("/data/grammar_details.json")
entries_path = os.path.dirname(__file__) + ("/data/grammar_entries.json")

def scrape_grammar_details(entries):
    details = []
    for entry in tqdm(entries):
        href = entry["href"]
        print(href)

        response = requests.get(f"https://takoboto.jp{href}")
        response.raise_for_status()  # Raise an error if the request fails
        cnt = response.content

        # cnt = open("a.html", "r").read()
        soup = BeautifulSoup(cnt, "html.parser")
        soup.prettify()

        # Initialize a dictionary to store the extracted data
        data_dict = {}

        # Extract the main grammar point
        main_grammar = soup.find("div", class_="GrammarPartMainDiv").find("span").text.strip()
        data_dict["main_grammar"] = main_grammar
        reading = soup.find("div", class_="GrammarPartJapDiv")
        if reading is not None:
            data_dict["reading"] = reading.text.strip()

        # Extract the JLPT level
        jlpt_level = soup.find("div", class_="GrammarPartSeparateMainDiv").find("span").text.strip()
        data_dict["jlpt_level"] = jlpt_level

        # Extract the meaning
        meaning_id = soup.find("div", id=re.compile(r"editbox_Meaning_\d+")).get("id")
        meaning = soup.find("div", id=meaning_id).find("div", class_="GrammarPartDiv").find_all("span")
        data_dict["meaning"] = {
            "actual": meaning[0].text.strip(),
            "context": meaning[1].text.strip(),
        }

        # Extract the formation
        formation_div = soup.find("div", id=re.compile(r"editable_Formation_\d+"))
        formation = []
        formation_elements = formation_div.find_all("div", style=lambda value: type(value) == str and re.search(r"background-color:\s*#ffffff",  value))
        if formation_elements is not None:
            for element in formation_elements:
                formation.append(element.text.strip())
            data_dict["formation"] = formation

        # Extract the "See also" links
        see_also = []
        see_also_links = soup.find("div", style=lambda value: value and re.search(r"display:\s*inline-block", value) and re.search(r"border-radius:\s*10px;", value))
        if see_also_links is not None:
            for link in see_also_links.find_all("a"):
                id = int(link.get("href").split("/")[-1])
                see_also.append(id)
            data_dict["see_also"] = see_also

        # Extract the phrases
        phrases = []
        phrase_boxes = soup.find_all("div", id=re.compile(r"editbox_Phrase_\d+"))
        if phrase_boxes is not None:
            for box in phrase_boxes:
                phrase_dict = {}
                japanese_phrase = box.find("div", lang="ja").find_all("span")

                phrase_dict["japanese"] = ''.join(['***'+sp.text+'***' if re.search(r"color:\s*#00b060", sp.get('style')) else sp.text for sp in japanese_phrase ])

                english_phrase = box.find("span", style=lambda value: value and re.search(r"vertical-align:\s*middle", value)).find_all("span")
                phrase_dict["english"] = ''.join(['***'+sp.text+'***' if re.search(r"color:\s*#00b060", sp.get('style')) else sp.text for sp in english_phrase ])

                phrases.append(phrase_dict)
            data_dict["phrases"] = phrases


        details.append(data_dict)

    return details


def scrape_grammar_entries(base_url, start_page=1, end_page=13):
    grammar_entries = []

    for page_num in tqdm(range(start_page, end_page + 1)):
        url = f"{base_url}?page={page_num}"
        response = requests.get(url)
        response.raise_for_status()  # Raise an error if the request fails

        soup = BeautifulSoup(response.content, 'html.parser')

        grammar_summaries = soup.find_all('div', class_='GrammarSummaryDiv')

        for summary in grammar_summaries:
            japanese_title = summary.find('div', lang='ja').text.strip()
            english_meaning = summary.find_all('div')[1].text.strip()
            example_sentence = summary.find_all('div')[2].text.strip()

            # Extract the href
            more_link = summary.find('a', href=True)
            href = more_link['href'] if more_link else None

            entry = {
                'japanese_title': japanese_title,
                'english_meaning': english_meaning,
                'example_sentence': example_sentence,
                'href': href
            }

            grammar_entries.append(entry)

    return grammar_entries

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Process HTML file and extract data.")

    # Add the mode argument
    parser.add_argument("mode", choices=["pages", "details"], help="Choose the mode of operation.")

    # Parse the arguments
    args = parser.parse_args()
    mode = args.mode

    base_url = "https://takoboto.jp/bunpo"
    if mode == "pages":
        entries_path = scrape_grammar_entries(base_url)

        # write to a file
        json_cnts = json.dumps(entries_path, indent=4, ensure_ascii=False)
        with open(details_path, 'w') as f:
            f.write(json_cnts)
    elif mode == "details":
        # load the entries
        with open(entries_path, 'r') as f:
            entries_path = json.load(f)

        # scrape the details
        details_path = scrape_grammar_details(entries_path)

        json_cnts = json.dumps(details_path, indent=4, ensure_ascii=False)
        with open(details_path, 'w') as f:
            f.write(json_cnts)
