const formatValue = (value: number): string => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// function formatValue(value: number): string {
//   const valueFormated = new Intl.NumberFormat('pt', {
//     style: 'currency',
//     currency: 'BRL',
//   }).format(value);

//   return valueFormated;
// }

// export function formatDate(value: Date): string {
//   const date = new Date(value);
//   const dateformated = new Intl.DateTimeFormat('pt', {
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//   });

//   return dateformated.format(date);
// }

export default formatValue;
