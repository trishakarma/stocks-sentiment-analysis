const getDirection = (value: string | number): "positive" | "negative" => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    return number >= 0 ? "positive" : "negative";
}
  
  export default getDirection;