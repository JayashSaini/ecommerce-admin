// components/CDNImage.tsx
import Image, { ImageProps } from "next/image";

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL; // Your base URL

interface CDNImageProps extends Omit<ImageProps, "src"> {
	src: string; // Relative path or key
}

export const CDNImage = ({ src, ...rest }: CDNImageProps) => {
	const fullSrc = `${CDN_BASE_URL}${src}`;
	return (
		<Image
			src={fullSrc}
			{...rest}
		/>
	);
};
