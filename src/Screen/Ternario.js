function Saludo({ esDeDia }) {
  return <h1>{esDeDia ? "Buenos días" : "Buenas noches"}</h1>;
}

export default function Ternario() {
  return <Saludo esDeDia={true} />;
}
