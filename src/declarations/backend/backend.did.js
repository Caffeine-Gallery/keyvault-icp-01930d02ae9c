export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'isAuthenticated' : IDL.Func([], [IDL.Bool], []),
    'login' : IDL.Func([], [Result], []),
    'logout' : IDL.Func([], [Result], []),
    'whoami' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
