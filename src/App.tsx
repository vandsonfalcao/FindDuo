import { useEffect, useState } from "react";
import logoImg from "./assets/logo-nlw-esports.svg";
import CreateAdBanner from "./components/CreateAdBanner";
import * as Dialog from "@radix-ui/react-dialog";
import GameBanner from "./components/GameBanner";
import "./styles/main.css";
import CreateAdModal from "./components/CreateAdModal";
import axios, { AxiosResponse } from "axios";

interface Game {
	uuid: string;
	title: string;
	bannerUrl: string;
	_count: {
		ads: number;
	};
}

function App() {
	const [games, setGames] = useState<Game[]>([]);

	useEffect(() => {
		axios("http://localhost:3333/games").then((res: AxiosResponse<Game[]>) => {
				setGames(res.data);
			});
	}, []);

	return (
		<div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
			<img src={logoImg} alt="FindDuoLogo" />

			<h1 className="text-6xl text-white font-black mt-20">
				Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">duo</span> está
				aqui.
			</h1>

			<div className="grid grid-cols-6 gap-6 mt-16">
				{games.map((game) => (
					<GameBanner
						key={game.uuid}
						adsCount={game._count.ads}
						bannerUrl={game.bannerUrl}
						title={game.title}
					/>
				))}
			</div>

			<Dialog.Root>
				<CreateAdBanner />
				<CreateAdModal />
			</Dialog.Root>
		</div>
	);
}

export default App;
