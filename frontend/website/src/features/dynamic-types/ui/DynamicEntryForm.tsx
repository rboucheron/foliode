import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CustomField } from "../domain/custom-type"
import { saveEntry } from "../application/dynamic-types.api"

export function DynamicEntryForm({siteId,typeId,fields,onSaved}:{siteId:string;typeId:string;fields:CustomField[];onSaved?:()=>void}) {
  const [values,setValues]=useState<Record<string,string>>({})
  const [error,setError]=useState("")
  const save=async()=>{try{await saveEntry(siteId,typeId,values);setValues({});onSaved?.()}catch{setError("Impossible d'enregistrer cette entrée.")}}
  return <form className="flex flex-col gap-3" onSubmit={e=>{e.preventDefault();void save()}}>
    {fields.map(field=><label key={field.key} className="flex flex-col gap-1 text-sm">{field.label}{field.type==="textarea"?<textarea className="min-h-24 rounded-md border bg-background p-2" value={values[field.key]??""} onChange={e=>setValues(v=>({...v,[field.key]:e.target.value}))}/>:<Input type={field.type==="date"?"date":field.type==="url"?"url":"text"} value={values[field.key]??""} onChange={e=>setValues(v=>({...v,[field.key]:e.target.value}))}/>}</label>)}
    {error&&<p role="alert" className="text-destructive">{error}</p>}<Button type="submit">Ajouter une entrée</Button>
  </form>
}
