"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import {
	IconArchive,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconGripVertical,
	IconLoader,
} from "@tabler/icons-react";

import React from "react";
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
import { Badge } from "@/components/ui/badge";

import { CSS } from "@dnd-kit/utilities";
import { formatPrismaDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setLimit,
	setPage,
	setProducts,
} from "@/features/slices/dashboardSlice";
import { ProductInterface } from "@/types/app";
import Link from "next/link";
import { CDNImage } from "@/components/common/cdn-image";

export function ProductTable() {
	const {
		products: data,
		limit,
		page,
	} = useAppSelector((state) => state.dashboard.paginatedProducts);

	const dispatch = useAppDispatch();

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => data?.map(({ id }) => id) || [],
		[data]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination: {
				pageIndex: page,
				pageSize: limit,
			},
		},

		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (updater) => {
			const newState =
				typeof updater === "function"
					? updater({ pageIndex: page, pageSize: limit })
					: updater;

			dispatch(setPage(newState.pageIndex));
			dispatch(setLimit(newState.pageSize));
		},
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
			dispatch(setProducts(arrayMove(data, oldIndex, newIndex)));
		}
	}

	return (
		<div className="relative flex flex-col gap-4 overflow-auto px-2 ">
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
			<div className="flex items-center  px-4">
				<div className="flex w-full items-center gap-8  justify-between">
					<div className="hidden items-center gap-2 lg:flex">
						<Label
							htmlFor="rows-per-page"
							className="text-sm font-medium"
						>
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger
								size="sm"
								className="w-20"
								id="rows-per-page"
							>
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem
										key={pageSize}
										value={`${pageSize}`}
									>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function DraggableRow({ row }: { row: Row<ProductInterface> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
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

const columns: ColumnDef<ProductInterface>[] = [
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
		accessorKey: "Name",
		header: "Name",
		cell: ({ row }) => {
			return (
				<Button
					variant="link"
					className="text-foreground w-fit px-0 text-left"
				>
					<Link href={`/dashboard/products/${row.original.id}`}>
						{row.original.name}
					</Link>
				</Button>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			return (
				<p className=" text-secondary-foreground w-[200px] px-0 text-left truncate">
					{row.original.description}
				</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge
				variant="outline"
				className="text-muted-foreground px-1.5"
			>
				{row.original.status === "PUBLISHED" ? (
					<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
				) : row.original.status === "UNPUBLISHED" ? (
					<IconLoader className="text-destructive" />
				) : (
					<IconArchive />
				)}
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			return (
				<p className="text-secondary-foreground w-fit px-0 text-left truncate">
					{row.original.category?.name}
				</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "basePrice",
		header: "Base Price (₹)", // Added Rupee sign in header
		cell: ({ row }) => (
			<p className="text-secondary-foreground w-fit px-0 text-left truncate">
				₹{row.original.basePrice} {/* Added Rupee sign before the price */}
			</p>
		),
	},
	{
		accessorKey: "createdAt",
		header: () => <div className="w-full text-right">Release Date</div>,
		cell: ({ row }) => (
			<p className="text-secondary-foreground w-fit px-0 text-left truncate">
				{formatPrismaDate(row.original.createdAt)}
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
