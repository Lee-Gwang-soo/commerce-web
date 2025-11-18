"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/atoms/Typography";

const footerVariants = cva("bg-gray-900 text-white border-t border-gray-800", {
  variants: {
    variant: {
      default: "bg-gray-900",
      dark: "bg-gray-950",
    },
    padding: {
      sm: "py-6 md:py-8",
      md: "py-8 md:py-12",
      lg: "py-10 md:py-16",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

const linkSections = [
  {
    title: "쇼핑",
    links: [
      { label: "전체상품", href: "/products" },
      { label: "신상품", href: "/new" },
      { label: "인기상품", href: "/best" },
    ],
  },
  {
    title: "카테고리",
    links: [
      { label: "전자기기", href: "/categories/ELECTRONIC" },
      { label: "스포츠", href: "/categories/SPORT" },
      { label: "식품", href: "/categories/FOOD" },
      { label: "패션", href: "/categories/FASHION" },
    ],
  },
  // {
  //   title: "고객지원",
  //   links: [
  //     { label: "고객센터", href: "/support" },
  //     { label: "자주 묻는 질문", href: "/faq" },
  //     { label: "배송안내", href: "/shipping" },
  //     { label: "반품/교환", href: "/returns" },
  //   ],
  // },
  // {
  //   title: "회사정보",
  //   links: [
  //     { label: "회사소개", href: "/about" },
  //     { label: "이용약관", href: "/terms" },
  //     { label: "개인정보처리방침", href: "/privacy" },
  //   ],
  // },
];

// const socialLinks = [
//   { icon: Facebook, href: "#", label: "Facebook" },
//   { icon: Instagram, href: "#", label: "Instagram" },
//   { icon: Twitter, href: "#", label: "Twitter" },
//   { icon: Youtube, href: "#", label: "Youtube" },
// ];

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
  showContactInfo?: boolean;
  companyName?: string;
  onNewsletterSubmit?: (email: string) => void;
}

const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      variant,
      padding,
      showSocialLinks = true,
      showContactInfo = true,
      companyName = "Commerce",
      ...props
    },
    ref
  ) => {
    return (
      <footer ref={ref} className={cn(footerVariants({ variant, padding }), className)} {...props}>
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-3">
                <Typography variant="h4" className="font-bold text-white">
                  {companyName}
                </Typography>
              </Link>
              <Typography variant="muted" className="mb-4 leading-relaxed text-gray-300 text-sm">
                최고의 상품과 서비스로 고객의 만족을 위해 항상 노력하는 이커머스 플랫폼입니다.
              </Typography>

              {/* Contact Info */}
              {showContactInfo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                    <span>1588-1234</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                    <span>support@commerce.com</span>
                  </div>
                </div>
              )}
            </div>

            {/* Link Sections - 모바일에서는 2열로 표시 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:col-span-4">
              {linkSections.map((section, index) => (
                <div key={index}>
                  <Typography variant="h6" className="mb-3 font-semibold text-white text-sm">
                    {section.title}
                  </Typography>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-xs text-gray-300 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6 bg-gray-800" />
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-2">
            {/* Copyright */}
            <Typography variant="small" className="text-gray-400 text-xs">
              © 2024 {companyName}. All rights reserved.
            </Typography>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export { Footer, footerVariants };
export default Footer;
