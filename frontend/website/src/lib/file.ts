export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to convert file to base64."))
        return
      }
      resolve(reader.result)
    }

    reader.onerror = () => reject(new Error("Unable to convert file to base64."))
    reader.readAsDataURL(file)
  })

export const filesToBase64 = (files: File[]): Promise<string[]> =>
  Promise.all(files.map((file) => fileToBase64(file)))
