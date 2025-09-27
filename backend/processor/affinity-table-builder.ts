import fs from "fs";
import path from "path";
import { AffinityGroup, MemberInRelation, Relation } from "../types/relation";

// Load data
const memberData: MemberInRelation[] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../wild/succession_relation_member.json"),
    "utf-8"
  )
);
const relationData: Relation[] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../wild/succession_relation.json"),
    "utf-8"
  )
);

// Group members by relation id and cross-check with relationData
const affinityMap: Map<number, AffinityGroup> = new Map();

// Create a lookup map for relation points by relation_type
const relationPointMap = new Map<number, number>();
for (const relation of relationData) {
  relationPointMap.set(relation.relation_type, relation.relation_point);
}

console.log(`Found ${relationData.length} relation types in relationData`);
console.log(`Found ${memberData.length} member records in memberData`);

console.log(`relationPointMap keys:`, Array.from(relationPointMap.keys()));
// Track unique relation types in memberData for validation
const memberRelationTypes = new Set<number>();

for (const member of memberData) {
  const { id, relation_type, chara_id } = member;
  memberRelationTypes.add(relation_type);

  if (relationPointMap.has(relation_type)) {
    if (!affinityMap.has(relation_type)) {
      affinityMap.set(relation_type, {
        id: id,
        relationType: relation_type,
        relationPoint: relationPointMap.get(relation_type)!,
        members: [],
      });
    }
    affinityMap.get(relation_type)!.members.push(chara_id);
  } else {
    console.log("skipped", chara_id);
  }
}

// Output result
const affinityGroups: AffinityGroup[] = Array.from(affinityMap.values());

fs.writeFileSync(
  path.resolve(__dirname, "../home/affinity-table.json"),
  JSON.stringify(affinityGroups, null, 2),
  "utf-8"
);

console.log(`\nAffinity table written to: ../home/affinity-table.json`);
