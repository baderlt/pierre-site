'use client';
import {useParams} from 'next/navigation';
const copy={fr:['Contenu indisponible','Veuillez réessayer.','Réessayer'],en:['Content unavailable','Please retry.','Retry'],ar:['المحتوى غير متاح','يرجى المحاولة مجددًا.','إعادة المحاولة']};
export default function ErrorPage({reset,retry}:{reset:()=>void;retry?:()=>void}){const {locale}=useParams();const c=copy[locale as keyof typeof copy]||copy.fr;return <main className="container section-space" role="alert"><h1>{c[0]}</h1><p>{c[1]}</p><button className="button button-gold" onClick={retry||reset}>{c[2]}</button></main>;}
