
export const generateRandomEmail = () => {
  return `${generateRandomName()}.${generateRandomName()}+1@gmail.com`;
};

export const generateRandomName = (length = 6) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let randomName = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomName += characters.charAt(randomIndex);
  }

  return randomName;
};

export const generatePerson = () => {
  return {
    firstName: generateRandomName(),
    lastName: generateRandomName(),
    email: generateRandomEmail(),
  };
};
