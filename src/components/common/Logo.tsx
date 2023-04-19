import { SVGProps } from 'react';

export function Logomark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} {...props}>
      <path
        d="M34.14 34.14c-7.808 7.813-20.472 7.813-28.28 0-7.813-7.808-7.813-20.472 0-28.28 7.808-7.813 20.472-7.813 28.28 0 7.813 7.808 7.813 20.472 0 28.28Zm0 0"
        style={{
          stroke: 'none',
          fillRule: 'nonzero',
          fill: '#9a1d2e',
          fillOpacity: 1,
        }}
      />
      <path
        d="M14.305 19.984a3.931 3.931 0 0 0 3.93-3.933 3.931 3.931 0 1 0-7.864 0 3.934 3.934 0 0 0 3.934 3.933ZM18.781 22.168c-1.535-.781-3.234-1.09-4.476-1.09-2.438 0-7.43 1.492-7.43 4.477v2.297h8.191v-.88c0-1.038.438-2.077 1.204-2.945.609-.691 1.464-1.336 2.511-1.859Zm0 0"
        style={{
          stroke: 'none',
          fillRule: 'nonzero',
          fill: '#fff',
          fillOpacity: 1,
        }}
      />
      <path
        d="M24.574 21.734c-2.844 0-8.523 1.754-8.523 5.243v2.62h17.043v-2.62c0-3.489-5.676-5.243-8.52-5.243ZM24.574 19.984a4.807 4.807 0 1 0-.005-9.614 4.807 4.807 0 0 0 .005 9.614Zm0 0"
        style={{
          stroke: 'none',
          fillRule: 'nonzero',
          fill: '#fff',
          fillOpacity: 1,
        }}
      />
    </svg>
  );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex flex-row items-center text-xl gap-2 text-exeter">
      <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
        <Logomark width="40" height="40" />
      </svg>
      StuCo Surveys
    </div>
  );
}
