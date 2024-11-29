// import { IStats } from '../queries/accountQueries';

// export function totalExpense(stats: IStats[]) {
//   if (stats.length === 0) return 0;
//   return stats.reduce((total, stat) => total + stat.expense, 0);
// }

// // export function totalIncome(stats: IStats[]) {
// //   return stats.reduce((total, stat) => total + stat.income, 0);
// // }

// export function averageExpense(stats: IStats[]) {
//   if (stats.length === 0) return 0;
//   return totalExpense(stats) / stats.length;
// }

// export function bestOfTime(stats: IStats[]) {
//   if (stats.length === 0) return 0;
//   return stats.sort((a, b) => b.expense - a.expense)[0];
// }

// export function worstOfTime(stats: IStats[]) {
//   if (stats.length === 0) return 0;
//   return stats.sort((a, b) => a.expense - b.expense)[0];
// }
