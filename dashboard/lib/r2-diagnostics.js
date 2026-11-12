/**
 * Safe errors for R2 authentication diagnostics.
 * Never echo the SDK exception message, request headers, or credential values.
 */
export function explainR2Failure(error) {
  const code=String(error?.name||'');
  const status=Number(error?.$metadata?.httpStatusCode)||0;
  if(error instanceof SyntaxError)
    return 'Budget ledger is not valid JSON. Stop and inspect the object in Cloudflare without replacing it.';
  if(code==='NoSuchKey'||code==='NotFound'||status===404)
    return 'Budget ledger object is missing from the selected bucket. Check R2_ACCOUNT_ID and R2_BUCKET. Do not reinitialize a populated bucket.';
  if(code==='SignatureDoesNotMatch')
    return 'S3 request signature mismatch. Check R2_SECRET_ACCESS_KEY, Access Key ID, and accidental spaces or quotes.';
  if(code==='InvalidAccessKeyId'||code==='Unauthorized'||status===401)
    return 'Invalid R2 S3 Access Key ID or an expired token. Use the Access Key ID from the R2 API token confirmation.';
  if(code==='AccessDenied'||status===403)
    return 'Access denied. Check both R2 S3 keys, Object Read & Write permissions, and bucket scope.';
  if(code==='InvalidArgument' || status===400) {
    // Only return a known HTTP/S3 header name, not the SDK message.
    const detail=String(error?.message||'').toLowerCase();
    const recognized=[
      'x-amz-checksum-mode','x-amz-sdk-checksum-algorithm',
      'x-amz-checksum-algorithm','x-amz-security-token','x-amz-content-sha256'
    ].find(header=>detail.includes(header));
    if(recognized)
      return 'R2 rejected the '+recognized+' request header (HTTP 400). Verify SDK compatibility and use long-term R2 S3 keys, not a general Cloudflare API token.';
    return 'R2 rejected a request argument (HTTP 400 InvalidArgument). Verify that R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are the S3 credential pair from the same bucket-scoped token, not the API token value. Check the Cloudflare account and bucket.';
  }
  if(code==='InvalidBucketName'||code==='NoSuchBucket')
    return 'Incorrect R2_BUCKET or account endpoint. The expected bucket is cookiequant-telemetry.';
  if(status===429||code==='SlowDown'||code==='TooManyRequests')
    return 'R2 requests are rate-limited. Retry after the request rate settles.';
  if(['TimeoutError','RequestTimeout','NetworkingError','ENOTFOUND','EAI_AGAIN','ECONNREFUSED','ECONNRESET'].includes(code))
    return 'Network or DNS problem reaching the R2 S3 endpoint.';
  if(code==='CredentialsProviderError')
    return 'S3 credentials could not be loaded from the environment.';
  return 'Unexpected R2 error'+(status?' (HTTP '+status+')':'')+(code?' ['+code.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40)+']':'')+'.';
}
