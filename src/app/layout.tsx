import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/global.scss";
import { Inter } from "next/font/google";
import "semantic-ui-css/semantic.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Workplus+",
  description: "Your ideal application for generating invoice!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
