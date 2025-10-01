import * as fs from "fs";
import * as path from "path";
import { CharacterNameID } from "../../types/characterNameId";
import { DressData } from "../../types/dressData";
import { TextData } from "../../types/textData";

const allTextsPath = path.resolve(__dirname, "../wild/all-texts.json");
const dressDataPath = path.resolve(__dirname, "../home/dress_data.json");

const allTextsRaw = fs.readFileSync(allTextsPath, "utf-8");
const allTexts: Array<TextData> = JSON.parse(allTextsRaw);

const dressDataRaw = fs.readFileSync(dressDataPath, "utf-8");
const dressData: Array<DressData> = JSON.parse(dressDataRaw);

const dressIds = new Set(dressData.map((item) => item.id));

const formatCharacterName = (item: TextData): CharacterNameID => ({
  chara_id: item.index.toString(),
  chara_name: item.text,
  chara_id_base: item.index.toString().slice(0, 4),
});

const result = allTexts
  .filter(
    (item) =>
      // matching "index" to "id" and category to 4 (character names)?
      dressIds.has(item.index.toString()) && item.category === 4
  )
  .map(formatCharacterName);

fs.writeFileSync(
  path.resolve(__dirname, "../home/chara_names_with_id.json"),
  JSON.stringify(result, null, 2)
);
