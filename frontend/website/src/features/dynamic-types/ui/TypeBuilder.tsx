import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ContentLayout, CustomField, CustomType, FieldType } from "../domain/custom-type"
import { saveCustomType } from "../application/dynamic-types.api"

export function TypeBuilder({ siteId, initialType, onSaved }: { siteId: string; initialType?: CustomType; onSaved?: (type: CustomType) => void }) {
  const [name,setName]=useState(initialType?.name ?? "")
  const [layout,setLayout]=useState<ContentLayout>(initialType?.layout ?? "list")
  const [fields,setFields]=useState<CustomField[]>(initialType?.fields ?? [])
  const [label,setLabel]=useState("")
  const [fieldType,setFieldType]=useState<FieldType>("text")
  const addField=()=>{if(!label.trim())return;setFields(current=>[...current,{key:label.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_"),label:label.trim(),type:fieldType,visible:true,order:current.length}]);setLabel("")}
  const save=async()=>{if(!name.trim())return;const type=await saveCustomType(siteId,{name,layout,fields},initialType?.id);onSaved?.(type)}
  return <section className="flex flex-col gap-4 rounded-xl border p-4">
    <h2 className="text-lg font-semibold">{initialType ? "Modifier le type" : "Créer un type de contenu"}</h2>
    <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du type (ex. Projet)" />
    <label className="flex flex-col gap-1 text-sm">Disposition<select className="rounded-md border bg-background p-2" value={layout} onChange={e=>setLayout(e.target.value as ContentLayout)}><option value="list">Liste</option><option value="grid">Grille</option><option value="cards">Cartes</option></select></label>
    <div className="flex flex-wrap gap-2"><Input className="max-w-xs" value={label} onChange={e=>setLabel(e.target.value)} placeholder="Nom de la propriété" /><select className="rounded-md border bg-background px-2" value={fieldType} onChange={e=>setFieldType(e.target.value as FieldType)}><option value="text">Texte</option><option value="textarea">Zone de texte</option><option value="date">Date</option><option value="url">URL</option></select><Button type="button" variant="outline" onClick={addField}>Ajouter</Button></div>
    <ul className="flex flex-col gap-2">{fields.map((field,index)=><li key={field.key} className="flex items-center gap-2"><span className="flex-1">{field.label} <span className="text-muted-foreground">({field.type})</span></span><label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={field.visible} onChange={e=>setFields(current=>current.map((item,i)=>i===index?{...item,visible:e.target.checked}:item))}/>Visible</label><Button size="sm" variant="ghost" disabled={index===0} onClick={()=>setFields(current=>{const next=[...current];[next[index-1],next[index]]=[next[index],next[index-1]];return next.map((item,i)=>({...item,order:i}))})}>↑</Button><Button size="sm" variant="ghost" disabled={index===fields.length-1} onClick={()=>setFields(current=>{const next=[...current];[next[index+1],next[index]]=[next[index],next[index+1]];return next.map((item,i)=>({...item,order:i}))})}>↓</Button><Button size="sm" variant="ghost" onClick={()=>setFields(current=>current.filter((_,i)=>i!==index).map((item,i)=>({...item,order:i})))}>Supprimer</Button></li>)}</ul>
    <Button onClick={save} disabled={!name.trim()}>Enregistrer le type</Button>
  </section>
}
