// apps/rentals/src/shared/styles/tailwindStyles.ts

const tailwindStyles = {
  mainBackground: "bg-gray-200",

  secondaryButton:
    "bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 text-sm font-semibold rounded-md text-center transition",

  dangerButton:
    "bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 text-base font-semibold rounded-md text-center transition",

  thirdButton:
    "text-gray-600 hover:bg-gray-200 px-4 py-2 text-sm font-semibold rounded-md text-center border border-[#ffc107] transition",

  card: "bg-gray-200",
  whiteCard: "bg-white",

  header: "bg-[#001433] text-white",
  header_item:
    "text-sm text-gray-300 hover:underline underline-offset-8 2xl:text-base transition",

  activeTab:
    "text-white underline decoration-2 underline-offset-8 font-semibold",

  logo: "h-6 lg:h-8",
  demoImage: "w-64 h-36 lg:w-96 lg:h-52 object-cover rounded-lg",

  heading: "text-[#001433]",

  heading_1:
    "text-[#001433] text-center text-lg lg:text-2xl 2xl:text-3xl font-bold leading-tight",

  heading_2:
    "text-[#001433] text-center text-xl lg:text-2xl 2xl:text-3xl font-bold",

  heading_3:
    "text-[#001433] text-sm md:text-base 2xl:text-lg font-semibold",

  heading_card:
    "text-[#001433] text-sm md:text-base lg:text-lg 2xl:text-xl font-semibold",

  heading_4:
    "text-[#001433] mb-1 text-xs md:text-sm 2xl:text-base font-semibold",

  paragraph:
    "text-gray-600 text-xs lg:text-sm 2xl:text-base leading-relaxed",

  paragraph_l:
    "text-gray-600 text-sm md:text-base 2xl:text-lg font-medium",

  paragraph_b:
    "text-gray-600 text-xs lg:text-sm 2xl:text-base font-semibold",

  paragraph_less:
    "text-gray-600 text-[10px] lg:text-xs 2xl:text-sm",
} as const;

export default tailwindStyles;