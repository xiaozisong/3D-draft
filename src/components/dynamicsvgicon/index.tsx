import { useEffect, useState } from "react";

export interface DynamicSvgIconProps {
  svgPath: string;
  size: number;
}

const DynamicSvgIcon = (props: DynamicSvgIconProps) => {
  const { size = 22, svgPath } = props;

  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch(svgPath)
      .then((response) => response.text())
      .then((data) => {
        setSvgContent(data);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }, [svgPath]);
  
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default DynamicSvgIcon;