import React from "react";

const Contacts: React.FC<IProps> = ({ fill = "#CCCCCC" }: IProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612" fill={fill}>
      <path d="M612 251.176c0-117.278-113.775-212.689-253.617-212.689-139.846 0-253.62 95.412-253.62 212.689s113.774 212.689 253.62 212.689c11.758 0 23.557-.681 35.157-2.025 53.864 34.218 93.627 52.947 118.272 55.685.857.093 1.72.141 2.565.141a23.422 23.422 0 0019.606-10.56c4.877-7.4 5.195-16.788.851-24.453-.202-.365-19.221-35.065-13.734-68.211 57.862-40.492 90.9-99.666 90.9-163.266zm-322.495 32.122c-20.751 0-37.568-16.821-37.568-37.569 0-20.749 16.817-37.569 37.568-37.569 20.747 0 37.571 16.821 37.571 37.569.001 20.748-16.823 37.569-37.571 37.569zm137.761 0c-20.754 0-37.575-16.821-37.575-37.569 0-20.749 16.821-37.569 37.575-37.569 20.747 0 37.568 16.821 37.568 37.569s-16.822 37.569-37.568 37.569z" />
      <path
        d="M158.343 421.342c-25.165-20.837-45.002-45.228-58.952-72.492-14.709-28.745-22.166-59.323-22.166-90.883 0-31.561 7.458-62.138 22.166-90.883 1.126-2.2 2.305-4.373 3.506-6.536C40.78 196.136 0 
255.532 0 322.675c0 60.323 32.495 116.253 89.264 153.875 10.485 41.219-13.846 84.828-14.103 85.274a7.827 7.827 0 00.275 8.167 7.826 7.826 0 007.402 3.472c28.402-3.154 78.417-32.021 116.307-56.361a289.486 289.486 0 0038.821 2.608c49.776 0 96.022-12.729 134.265-34.449a322.869 322.869 0 01-25.73 1.049c-70.735 0-137.557-23.073-188.158-64.968z"
      />
    </svg>
  );
};
interface IProps {
  fill?: string;
}
export default Contacts;