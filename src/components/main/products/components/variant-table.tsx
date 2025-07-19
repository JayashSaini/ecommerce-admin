"use client";

import { Button } from "@/components/ui/button";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import React, { useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { CSS } from "@dnd-kit/utilities";

import { VariantInterface } from "@/types/app";
import {
	IconGripVertical,
	IconReload,
	IconSortAscending,
} from "@tabler/icons-react";
import Link from "next/link";
import { CreateVariantDialog } from "./dialog/create-variant";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "./searchbar";
import { CDNImage } from "@/components/common/cdn-image";

export function VariantTable({
	initialData,
	reloadProduct,
	productId,
}: {
	initialData: VariantInterface[];
	reloadProduct: () => Promise<void>;
	productId: number;
}) {
	const [variants, setVariants] = useState<VariantInterface[]>(initialData);

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [reloadLoading, setReloadLoading] = useState(false);
	const [globalFilterValue, setGlobalFilterValue] = useState("");

	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => variants?.map(({ id }) => id) || [],
		[variants]
	);

	const table = useReactTable({
		data: variants,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},

		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,

		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = dataIds.indexOf(active.id);
			const newIndex = dataIds.indexOf(over.id);
			setVariants(arrayMove(variants, oldIndex, newIndex));
		}
	}

	return (
		<Card className="@container/card col-span-5 relative flex flex-col gap-4 overflow-auto  border-border border-1 px-4 py-6 rounded-xl ">
			<CardHeader className="flex w-full justify-between px-2">
				<CardTitle className="sm:text-md text-base font-medium">
					Variants
				</CardTitle>
				<CardAction className="flex gap-2">
					<SearchBar
						value={globalFilterValue}
						onChange={(e) => {
							const value = e.target.value;
							setGlobalFilterValue(value);
							table.getColumn("title")?.setFilterValue(value); // filter by title
						}}
						className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
					/>

					<Button
						variant="outline"
						size="icon"
						onClick={async () => {
							setReloadLoading(true);
							await reloadProduct();
							setReloadLoading(false);
						}}
						disabled={reloadLoading || variants.length == 0}
					>
						{reloadLoading ? (
							<IconReload className="h-[1.2rem] w-[1.2rem] transition-all animate-spin" />
						) : (
							<IconReload className="h-[1.2rem] w-[1.2rem] transition-all " />
						)}
						<span className="sr-only">Reload products</span>
					</Button>
					<CreateVariantDialog productId={productId} />
				</CardAction>
				
			</CardHeader>
			<div className="overflow-hidden rounded-lg border">
				<DndContext
					collisionDetection={closestCenter}
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={handleDragEnd}
					sensors={sensors}
					id={sortableId}
				>
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								<SortableContext
									items={dataIds}
									strategy={verticalListSortingStrategy}
								>
									{table.getRowModel().rows.map((row) => (
										<DraggableRow
											key={row.id}
											row={row}
										/>
									))}
								</SortableContext>
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</DndContext>
			</div>
		</Card>
	);
}

function DraggableRow({ row }: { row: Row<VariantInterface> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});
	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 "
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

const columns: ColumnDef<VariantInterface>[] = [
	{
		id: "drag",
		header: () => null,
		cell: ({ row }) => <DragHandle id={row.original.id} />,
	},
	{
		accessorKey: "images",
		header: "Images",
		cell: ({ row }) => (
			<CDNImage
				alt={"variants"}
				src={row.original.images[0].key}
				height={30}
				width={30}
				className="rounded-sm"
			/>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<button
				className="flex items-center gap-1"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Title
				{column.getIsSorted() === "asc" && (
					<IconSortAscending className="w-3 h-3" />
				)}
				{column.getIsSorted() === "desc" && (
					<IconSortAscending className="w-3 h-3 rotate-180" />
				)}
			</button>
		),
		cell: ({ row }) => (
			<Button
				variant="link"
				className="text-foreground w-fit px-0 text-left"
			>
				<Link href={`/dashboard/products/variants/${row.original.id}`}>
					{row.original.title}
				</Link>
			</Button>
		),
	},
	{
		accessorKey: "color",
		header: "Color",
		cell: ({ row }) => (
			<p className="text-secondary-foreground capitalize">
				{row.original.color}
			</p>
		),
	},
	{
		accessorKey: "material",
		header: "Material",
		cell: ({ row }) => (
			<p className="text-secondary-foreground capitalize">
				{row.original.material}
			</p>
		),
	},
	{
		accessorKey: "size",
		header: "Sizes Available",
		cell: ({ row }) => (
			<p className="text-secondary-foreground">
				{row.original.size?.join(", ")}
			</p>
		),
	},
	{
		accessorKey: "stockQty",
		header: ({ column }) => (
			<button
				className="flex items-center gap-1"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Stock Qty
				{column.getIsSorted() === "asc" && (
					<IconSortAscending className="w-3 h-3" />
				)}
				{column.getIsSorted() === "desc" && (
					<IconSortAscending className="w-3 h-3 rotate-180" />
				)}
			</button>
		),
		cell: ({ row }) => (
			<p className="text-secondary-foreground">{row.original.stockQty}</p>
		),
	},

	{
		accessorKey: "additionalPrice",
		header: ({ column }) => (
			<button
				className="flex items-center gap-1"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Additional Price (₹)
				{column.getIsSorted() === "asc" && (
					<IconSortAscending className="w-3 h-3" />
				)}
				{column.getIsSorted() === "desc" && (
					<IconSortAscending className="w-3 h-3 rotate-180" />
				)}
			</button>
		),
		cell: ({ row }) => (
			<p className="text-secondary-foreground">
				₹{row.original.additionalPrice}
			</p>
		),
	},
];

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
	const { attributes, listeners } = useSortable({
		id,
	});

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent"
		>
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}
