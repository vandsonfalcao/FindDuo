import * as RS from "@radix-ui/react-select";
import { Check } from "phosphor-react";

interface ReactSelectItemProps {
  value: string
  optionName: string
}

export default function ReactSelectItem({ optionName, value}: ReactSelectItemProps) {
	return (
		<RS.Item
			value={value}
			className="text-sm flex items-center justify-between h-10 px-8 hover:bg-white hover:text-zinc-900 select-none cursor-pointer"
		>
			<RS.ItemText>{optionName}</RS.ItemText>
			<RS.ItemIndicator>
				<Check className="text-2xl"/>
			</RS.ItemIndicator>
		</RS.Item>
	);
}
