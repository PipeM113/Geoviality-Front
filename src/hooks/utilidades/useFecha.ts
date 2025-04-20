function useFecha() {
  const convertir_date_a_string = (date: string) => {
    const date_object = new Date(date);
    return date_object.toLocaleDateString() + " " + date_object.toLocaleTimeString();
  }

  return {
    convertir_date_a_string
  }
}

export default useFecha;
