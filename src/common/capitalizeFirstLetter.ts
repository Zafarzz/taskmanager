const capitalizeFirstLetter = (text: string | undefined): string => {
  if (!text) return '';

  const words = text.split(" ");

  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  return words.join(" ");
}

export default capitalizeFirstLetter;
