const allowedIp = '192.168.10.114';

export const ipRestrictionMiddleware = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  console.log(`IP do cliente: ${clientIp}`);
  // Verifica se o IP é o permitido
  if (clientIp === allowedIp || clientIp === `::1`) {
    next(); // O IP é permitido, continue
  } else {
    return res.status(403).json({ message: 'Acesso negado: IP não autorizado' });
  }
};