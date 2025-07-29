import type { SVGProps } from "react"

export const Icons = {
  visa: (props: SVGProps<SVGSVGElement>) => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff" />
      <path d="M15.2 14.5l-2.3-8.8H10l2.3 8.8h2.9zm6.6-8.8h-2.1l-1.3 4.8c-.1.5-.2 1-.3 1.5h.1c.1-.5.2-1 .3-1.5l1.3-4.8h2.1l-2.3 8.8h-2.9l2.3-8.8zm-13.3 2.1c-.2-.2-.5-.3-.9-.3-.5 0-1.2.3-1.2.9 0 .5.6.8 1 1 .4.2.5.3.5.4s-.2.2-.5.2c-.4 0-.7-.1-1-.3l-.2-.1-.2.9c.3.2.7.3 1.1.3.6 0 1.3-.3 1.3-.9s-.5-.8-1-1c-.3-.1-.5-.3-.5-.4s.2-.2.5-.2c.3 0 .6.1.8.2l.1.1.2-.8zm9.3-2.1h-2.8c-.4 0-.7.1-1 .3l-.2-.9h2.9l.9-3.7h3.1l-1 8.8h-2.9l.1-1.8zm-15.1 0h-3.1l-1.6 8.8h2.9l.2-1.3h1.9l.3 1.3h2.9l-1.5-8.8zm-1.8 5.7l.6-2.9h.1l.3 2.9h-1zm21.3-5.7l-1-4.3-1.9 6.2-1.1-1.9h-2.9l1.8 8.8h3.2l5-8.8h-2.9l-1.2 2.7z" fill="#142688" />
    </svg>
  ),
  mastercard: (props: SVGProps<SVGSVGElement>) => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" />
      <path d="M22 12c0-3.9-3.1-7-7-7-1.9 0-3.6.7-4.9 2-1.1 1.3-1.8 2.9-1.8 4.7 0 3.9 3.1 7 7 7 1.9 0 3.6-.7 4.9-2 1.1-1.3 1.8-2.9 1.8-4.7z" fill="#FF5F00" />
    </svg>
  ),
  amex: (props: SVGProps<SVGSVGElement>) => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#0077C8" />
      <path d="M12.9 16.4H15l.9-2.6h3.2l-.9 2.6h2.1l.9-2.6h3.2l-1 2.6h2.1l1.5-4.2-1.5-4.2h-2.1l1 2.6h-3.2l.9-2.6h-2.1l-.9 2.6h-3.2l.9-2.6H15l-1.5 4.2zm6.6-4.2h3.2l-.5 1.4h-3.2l.5-1.4zm-4.1 0h3.2l-.5 1.4h-3.2l.5-1.4zM24.8 8h-2.1l-1.5 4.2 1.5 4.2h2.1L23.3 14l1.5-6zM9.6 8H7.5l-1.5 4.2L7.5 16.4h2.1L8.1 14l1.5-6z" fill="#fff" />
    </svg>
  ),
  paypal: (props: SVGProps<SVGSVGElement>) => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff" />
      <path d="M24.4 8.7c-.3-1.4-1.2-2.5-2.7-2.5H16c-.5 0-.8.3-.9.8l-1.6 9.9c0 .4.3.7.7.7h2.8c.4 0 .7-.3.8-.7l.2-1.4.1-.4c.3 1 1.3 1.6 2.4 1.6 2.3 0 4.1-1.9 4.5-4.4.2-1.3 0-2.5-.6-3.3zm-3.5 3.3c-.3 1.4-1.4 2.4-2.8 2.4-1.1 0-1.8-.6-2.1-1.6l.8-5h1.7c1 0 1.8.6 1.6 2.2zM12.9 8.7c-.3-1.4-1.2-2.5-2.7-2.5H4.8c-.5 0-.8.3-.9.8L2.3 17c0 .4.3.7.7.7h2.8c.4 0 .7-.3.8-.7l.2-1.4.1-.4c.3 1 1.3 1.6 2.4 1.6C11.6 17 13 15.3 13.3 13c.2-1.2.1-2.4-.4-3.3zm-3.5 3.3c-.3 1.4-1.4 2.4-2.8 2.4-1.1 0-1.8-.6-2.1-1.6L5.3 9h1.7c1 0 1.8.6 1.6 2.2z" fill="#0070BA" />
    </svg>
  ),
  tiktok: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 8.25c0-2.34-1.9-4.25-4.24-4.25-1.12 0-2.14.44-2.9 1.19-.75.75-1.18 1.78-1.18 2.9v7.22c0 .98-.8 1.78-1.78 1.78s-1.78-.8-1.78-1.78V5.5c0-1.24.47-2.36 1.25-3.19C13.25 1.44 14.38 1 15.5 1c2.34 0 4.24 1.9 4.24 4.24v3.01"/>
    </svg>
  ),
  apparel: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 7.33V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.33"/>
        <path d="M15 4l-3-3-3 3"/>
        <path d="M12 1v12"/>
        <path d="M19.5 12.5a2.5 2.5 0 0 1-5 0V7.33"/>
        <path d="M4.5 12.5a2.5 2.5 0 0 0 5 0V7.33"/>
    </svg>
  ),
  gloves: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 14.5a1.5 1.5 0 1 0-3 0v-6a1.5 1.5 0 1 0-3 0v5.5a5.5 5.5 0 0 0 4.5 5.42 5.5 5.5 0 0 0 5.5-5.42V13a1.5 1.5 0 0 0-3 0v1.5"/>
      <path d="M14.5 14.5a1.5 1.5 0 1 0-3 0v-6a1.5 1.5 0 1 0-3 0"/>
      <path d="M5 16.5a1.5 1.5 0 1 0-3 0v-4a1.5 1.5 0 1 0-3 0"/>
    </svg>
  ),
};
