// 详见 [Elegant patterns in modern JavaScript: RORO](https://www.codementor.io/billsourour897/elegant-patterns-in-modern-javascript-roro-hn217atuu)

export function pipe(...fns) {
	return param => fns.reduce((result, fn) => fn(result), param);
}

export function requiredParam (param) {
  const requiredParamError = new Error(
   `Required parameter, "${param}" is missing.`
  )

// preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredParamError, 
      requiredParam
    )
  }

  throw requiredParamError;
}
