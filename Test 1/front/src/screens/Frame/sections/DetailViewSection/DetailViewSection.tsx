import { XIcon } from "lucide-react";
import LetterIcon from '/src/assets/icons/letter.svg?react';
import PhoneIcon from '/src/assets/icons/phone.svg?react';
import SearchIcon from '/src/assets/icons/search.svg?react';
import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../../components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

let debounceTimeout: NodeJS.Timeout;

export const DetailViewSection = (): JSX.Element => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedContact, setSelectedContact] = useState<ContactData | null>(
		null
	);
	const [contacts, setContacts] = useState<ContactData[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const url = searchTerm
				? `http://localhost:3000?term=${encodeURIComponent(searchTerm)}`
				: "http://localhost:3000";

			fetch(url)
				.then((res) => res.json())
				.then((response) => setContacts(response.data))
				.catch((err) => console.error("Ошибка загрузки:", err));
		}, 300); // debounce 300ms
	}, [searchTerm]);

	const handleCardClick = (contact: ContactData) => {
		setSelectedContact(contact);
		setIsDialogOpen(true);
	};

	return (
		<section className="w-full bg-white py-16 px-20 relative">
			<div className="relative">
				<div className="mb-8">
					<div className="relative w-full">
						<Input
							className="w-full rounded-full pr-10"
							placeholder="Поиск..."
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
						/>
						<SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
					</div>
				</div>

				{contacts.length === 0 ? (
					<div className="text-center text-gray-500">Ничего не найдено</div>
				) : (
					<div className="grid grid-cols-3 gap-6">
						{contacts.map((contact, index) => (
							<Card
								key={index}
								className="shadow-[0px_0px_20px_#0000001a] rounded-2xl cursor-pointer"
								onClick={() => handleCardClick(contact)}
							>
								<CardHeader>
									<CardTitle className="font-h2 font-[number:var(--h2-font-weight)] text-plumbum text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
										{contact.name}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col gap-3">
									<div className="flex items-center gap-3.5">
										<PhoneIcon className="w-6 h-6 text-asphalt" />
										<span className="font-text-14">{contact.phone}</span>
									</div>
									<div className="flex items-center gap-3.5">
										<LetterIcon className="w-6 h-6 text-asphalt" />
										<span className="font-text-14">{contact.email}</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Диалог */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
					<DialogHeader className="flex flex-row items-center justify-between">
						<DialogTitle className="font-h2">
							{selectedContact?.name}
						</DialogTitle>
						{/* <XIcon
							className="h-5 w-5 cursor-pointer"
							onClick={() => setIsDialogOpen(false)}
						/> */}
					</DialogHeader>

					{selectedContact && (
						<>
							<div className="flex items-start gap-10 py-4">
								<div className="flex flex-col gap-3.5">
									<div className="font-text-18-24">Телефон:</div>
									<div className="font-text-18-24">Почта:</div>
									<div className="font-text-18-24">Дата приема:</div>
									<div className="font-text-18-24">Должность:</div>
									<div className="font-text-18-24">Подразделение:</div>
								</div>

								<div className="flex flex-col gap-3.5 flex-1">
									<div className="text-base">{selectedContact.phone}</div>
									<div className="text-base">{selectedContact.email}</div>
									<div className="text-base">{selectedContact.hire_date}</div>
									<div className="text-base">
										{selectedContact.position_name}
									</div>
									<div className="text-base">{selectedContact.department}</div>
								</div>
							</div>

							<Separator className="my-2" />
							<div className="flex flex-col gap-3 pt-2">
								<div className="font-text-18-24">
									Дополнительная информация:
								</div>
								<div className="text-base">
									Разработчики используют текст в качестве заполнителя макта
									страницы. Разработчики используют текст в качестве заполнителя
									макта страницы.
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</section>
	);
};

interface ContactData {
	name: string;
	phone: string;
	email: string;
	address?: string;
	hire_date: string;
	position_name: string;
	department: string;
	additionalInfo: string;
}
