export type MemberInRelation = {
  id: number
  relation_type: number
  chara_id: number
}

export type Relation = { relation_type: number; relation_point: number }

export type AffinityGroup = {
  id: number
  relationType: number
  relationPoint: number
  members: number[]
}
