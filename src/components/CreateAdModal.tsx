import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import axios, { AxiosResponse } from "axios";
import { CaretDown, CaretUp, Check, GameController } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import Input from "./Form/Input";
import ReactSelectItem from "./Form/ReactSelectItem";

interface Game {
	uuid: string;
	title: string;
}

export default function CreateAdModal() {
	const [discordIsValid, setDiscordIsValid] = useState<boolean | null>(null);
	const [weekDays, setWeekDays] = useState<string[]>([]);
	const [useVoiceChannel, setUseVoiceChannel] = useState(false);
	const [games, setGames] = useState<Game[]>([]);

	useEffect(() => {
		axios("http://localhost:3333/games").then((res: AxiosResponse<Game[]>) => {
			setGames(res.data);
		});
	}, []);

	async function verifyIfDiscordExistInGame(event: FormEvent<HTMLInputElement>) {
		if(event.currentTarget.value === ""){
			setDiscordIsValid(null);
			return
		}
		const game = document.querySelectorAll<HTMLSelectElement>("option:checked");

		if (!game.length) {
			return;
		}
		axios
			.post(`http://localhost:3333/verifyIfDiscordExistInGame/${game[0].value}`, {
				discord: event.currentTarget.value,
			})
			.then((res: AxiosResponse<boolean>) => {
				setDiscordIsValid(!res.data);
			});
	}

	async function handleCreateAd(event: FormEvent) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData);

		if (!data.name || discordIsValid) {
			return;
		}

		try {
			await axios.post(`http://localhost:3333/game/${data.game}/ads`, {
				name: data.name,
				yearsPlaying: Number(data.yearsPlaying),
				discord: data.discord,
				weekDays: weekDays.map(Number),
				hourStart: data.hourStart,
				hourEnd: data.hourEnd,
				useVoiceChannel: useVoiceChannel,
			});

			alert("Anúncio criado com sucesso");
		} catch (err) {
			console.log(err);
			alert("Erro ao criar o anúncio");
		}
	}

	return (
		<Dialog.Portal>
			<Dialog.Overlay className="bg-black/60 inset-0 fixed">
				<Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25 overflow-hidden">
					<Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>
					<form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="font-semibold" htmlFor="game">
								Qual o game?
							</label>
							<Select.Root name="game" >
								<Select.SelectTrigger aria-required
									aria-label="game"
									className="py-3 px-4 flex items-center justify-between bg-zinc-900 rounded text-sm"
								>
									<Select.Value placeholder="Selecione o game que deseja jogar" />

									<Select.Icon>
										<CaretDown className="text-zinc-500" />
									</Select.Icon>
								</Select.SelectTrigger>

								<Select.Portal>
									<Select.Content className="bg-zinc-900 text-white rounded shadow shadow-black/25">
										<Select.ScrollUpButton className="h-8 flex items-center justify-center">
											<CaretUp className="text-2xl" />
										</Select.ScrollUpButton>

										<Select.Viewport>
											{games.map((game) => (
												<ReactSelectItem
													optionName={game.title}
													value={game.uuid}
													key={game.uuid}
												/>
											))}
										</Select.Viewport>

										<Select.ScrollDownButton className="h-8 flex items-center justify-center">
											<CaretDown className="text-2xl" />
										</Select.ScrollDownButton>
									</Select.Content>
								</Select.Portal>
							</Select.Root>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-semibold" htmlFor="name">
								Seu nome (ou nickname)
							</label>
							<Input
								type="text"
								name="name"
								id="name"
								placeholder="Como te chamam dentro do game?"
								required
							/>
						</div>

						<div className="grip grid-cols-2 gap-6">
							<div className="flex flex-col gap-2">
								<label className="font-semibold" htmlFor="yearsPlaying">
									Joga há quantos anos?
								</label>
								<Input
									type="number"
									name="yearsPlaying"
									id="yearsPlaying"
									placeholder="Tudo bem ser ZERO"
									required
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="font-semibold" htmlFor="discord">
									Qual o seu Discord?
								</label>
								<Input
									type="text"
									name="discord"
									id="discord"
									placeholder="Usuario#0000"
									onInput={verifyIfDiscordExistInGame}
									required
								/>
								{discordIsValid !== null && (
									<small
										className={`${
											discordIsValid ? "text-zinc-500" : "text-red-800"
										}`}
									>
										{discordIsValid
											? "Discord Valido."
											: "Já existe um anúncio para esse jogo com essa conta."}
									</small>
								)}
							</div>
						</div>

						<div className="flex gap-6">
							<div className="flex flex-col gap-2">
								<label className="font-semibold" htmlFor="weekDays">
									Quando costuma jogar?
								</label>
								<ToggleGroup.Root
									type="multiple"
									className="grid grid-cols-4 gap-2"
									value={weekDays}
									onValueChange={setWeekDays}
								>
									{[
										{
											value: "0",
											title: "Domingo",
										},
										{
											value: "1",
											title: "Segunda",
										},
										{
											value: "2",
											title: "Terça",
										},
										{
											value: "3",
											title: "Quarta",
										},
										{
											value: "4",
											title: "Quinta",
										},
										{
											value: "5",
											title: "Sexta",
										},
										{
											value: "6",
											title: "Sábado",
										},
									].map((dia) => (
										<ToggleGroup.Item
											key={dia.value}
											value={dia.value}
											className={`w-8 h-8 rounded ${
												weekDays.includes(dia.value)
													? "bg-violet-500"
													: "bg-zinc-900"
											}`}
											title={dia.title}
										>
											{dia.title[0]}
										</ToggleGroup.Item>
									))}
								</ToggleGroup.Root>
							</div>
							<div className="flex flex-col gap-2 flex-1">
								<label className="font-semibold" htmlFor="hourStart">
									Qual horário do dia?
								</label>
								<div className="grid grid-cols-2 gap-2">
									<Input
										type="time"
										name="hourStart"
										id="hourStart"
										placeholder="De"
										required
									/>
									<Input
										type="time"
										name="hourEnd"
										id="hourEnd"
										placeholder="Até"
										required
									/>
								</div>
							</div>
						</div>

						<label className="mt-2 flex items-center gap-2 text-sm font-semibold">
							<Checkbox.Root
								required
								className="w-6 h-6 p-1 rounded bg-zinc-900"
								checked={useVoiceChannel}
								onCheckedChange={(checked) => {
									if (checked === true) {
										setUseVoiceChannel(true);
									} else {
										setUseVoiceChannel(false);
									}
								}}
							>
								<Checkbox.Indicator>
									<Check className="w-4 h-4 text-emerald-400" />
								</Checkbox.Indicator>
							</Checkbox.Root>
							Constumo me conectar ao chat de voz
						</label>

						<footer className="mt-4 flex justify-end gap-4">
							<Dialog.Close className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600">
								Cancelar
							</Dialog.Close>
							<button className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600">
								<GameController className="w-6 h-6" />
								Encontrar duo
							</button>
						</footer>
					</form>
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Portal>
	);
}
