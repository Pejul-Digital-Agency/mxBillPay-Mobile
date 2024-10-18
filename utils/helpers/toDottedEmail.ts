export const toDottedEmail = (email: string) => {
  return (
    email.split('@')[0].substring(0, 3) + '*****' + '@' + email.split('@')[1]
  );
};
