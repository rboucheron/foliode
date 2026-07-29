'use client';

import { FileInput } from '../../ui/foliode/fileinput';
import { Input, Label, TextField } from '@heroui/react';
import { HerouiButton as Button } from '../../ui/heroui/button';
import { Tools } from '@rboucheron/types';

type secondStepInputs = {
  tool: {
    label: string;
    placeholder: string;
  }
  deleteButton: {
    label: string;
  }
  addButton: {
    label: string;
  }
}

interface secondStepFormProps {
  setTools: (tools: Tools[]) => void
  tools: Tools[]
  inputs: secondStepInputs

}

export const SecondStepForm = ({ setTools, tools, inputs }: secondStepFormProps) => {
  const handleCompetenceChange = (index: number, field: string, value: string | File) => {
    const newTools = [...tools];
    newTools[index] = {
      ...newTools[index],
      [field]: value,
    };
    setTools(newTools);
  };

  const addCompetence = () => {
    const newCompetence = { name: "", image: null };
    setTools([...tools, newCompetence]);
  };

  const handleDeleteCompetence = (index: number) => {
    const newTools = tools.filter((_, i) => i !== index);
    setTools(newTools);
  };

  return (

    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Compétences</h3>
      {tools.map((tool, index) => (
        <div key={index} className="border p-3 rounded-md space-y-3">
          <TextField isRequired>
            <Label>{inputs.tool.label}</Label>
            <Input
              value={tool.name ?? ""}
              onChange={(e) => handleCompetenceChange(index, "name", e.target.value)}
              placeholder={inputs.tool.placeholder}
            />
          </TextField>
          <div>
            <label className="block text-sm font-medium mb-1">Image de la compétence</label>
            <FileInput
              onChange={(files) =>
                handleCompetenceChange(index, "image", files[0])
              }
              files={tool.image ? [tool.image] : []}
              id={`file-${index}`}
              isRequired
            />
            <span className="text-sm text-gray-500 mt-1">Format recommandé : PNG ou JPG, max 2MB</span>
          </div>

          <Button
            text={inputs.deleteButton.label}
            variant="primary"
            size="md"
            onPress={() => handleDeleteCompetence(index)}
            className="w-full bg-danger"
          />
        </div>
      ))}
      <Button
        text={inputs.addButton.label}
        variant="primary"
        size="md"
        onPress={addCompetence}
        className='dayMode bg-primary text-white w-full'
      />
    </div>
  );
}

export default SecondStepForm;
