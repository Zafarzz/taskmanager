const colors = [
  {
    id: 1,
    color:
      "linear-gradient(0deg, #5694D6, #5694D6), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
    secondary_color: "rgba(86, 148, 214, 0.5)",
    color80: "rgba(86, 148, 214, .08)",
    color120: "rgba(86, 148, 214, .12)",
    color250: "rgba(86, 148, 214, .25)",
    color1000: "rgba(86, 148, 214, 1)",
  },
  {
    id: 2,
    color:
      "linear-gradient(0deg, #44A9AB, #44A9AB), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
    secondary_color: "rgba(68, 169, 171, 0.5)",
    color80: "rgba(68, 169, 171, .08)",
    color120: "rgba(68, 169, 171, .12)",
    color250: "rgba(68, 169, 171, .25)",
    color1000: "rgba(68, 169, 171, 1)",
  },
  {
    id: 3,
    color:
      "linear-gradient(0deg, #6463B0, #6463B0), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
    secondary_color: "rgba(100, 99, 176, 0.5)",
    color80: "rgba(100, 99, 176, .08)",
    color120: "rgba(100, 99, 176, .12)",
    color250: "rgba(100, 99, 176, .25)",
    color1000: "rgba(100, 99, 176, 1)",
  },
];

const useUserColor = (id: number) => {
  if (id === undefined || id === null || isNaN(id)) {
    return colors[0];
  }
  const index = id % colors.length;
  return colors[index];
};

export default useUserColor;
