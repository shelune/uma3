# Data Source

- all_texts.json -> directly from master.mdb (game client)
  - Uma names & texts
  - needs to rerun every patch with new characters
  - - Run `sqlite3 -json master.db "SELECT * FROM text_data;" > all-texts.json`
- skills.json -> https://www.tracenacademy.com/api/skilldata -> SkillData
  - rerun every now and then
- dress_data -> directly from master.mdb
  - Uma ID & name references
  - needs to rerun every patch with new characters
  - Run `sqlite3 -json master.db "SELECT * FROM dress_data;" > dress_data.json`
- succession_relation_member.json -> directly from master.mdb
  - Uma affinity group
  - needs to rerun every patch with new characters
  - Run `sqlite3 -json master.db "SELECT * FROM succession_relation_member;" > succession_relation_member.json`
- succession_relation.json -> directly from master.mdb
  - Uma affinity point per group
  - needs to rerun every patch with new characters
  - Run `sqlite3 -json master.db "SELECT * FROM succession_relation;" > succession_relation.json`
