export function Brand({name='TIME STONE',logo=''}:{name?:string;logo?:string}) {
  return <span className="brand" dir="ltr">
    {logo?<img src={logo} alt="" width="52" height="38"/>:<svg viewBox="0 0 60 44" width="52" height="38" fill="none" aria-hidden="true"><path d="M9 39V12a8 8 0 0 1 16 0v20a8 8 0 0 0 16 0V12a8 8 0 0 1 16 0v27" stroke="currentColor" strokeWidth="4" /></svg>}
    <span className="brand-name">{name}</span><span className="brand-caption">MARBRE & PIERRE</span>
  </span>;
}
