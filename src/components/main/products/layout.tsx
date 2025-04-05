import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconDownload } from "@tabler/icons-react";
import { Products } from "./products";
import { Categories } from "./categories";

import { CreateProductDialog } from "./components/dialog/create-product";

export function Layout() {
	return (
		<>
			<div className="w-full h-auto ">
				<Tabs
					defaultValue="products"
					className="w-full"
				>
					<TabsList className="bg-transparent w-full ">
						<div className="w-full  flex justify-between ">
							<div>
								<TabsTrigger
									className="rounded-sm  text-sm px-4 py-1 data-[state=active]:bg-transparent data-[state=active]:text-secondary-foreground text-muted-foreground"
									value="products"
								>
									Products
								</TabsTrigger>
								<TabsTrigger
									className="rounded-sm  text-sm px-4 py-1 data-[state=active]:bg-transparent  data-[state=active]:text-secondary-foreground text-muted-foreground"
									value="categories"
								>
									Categories
								</TabsTrigger>
							</div>
							<div className="flex gap-2 text-foreground ">
								<Button
									variant="outline"
									size="sm"
									className="text-xs"
								>
									<IconDownload />
									<span className="sm:flex hidden">Export Products</span>
								</Button>

								<CreateProductDialog />
							</div>
						</div>
					</TabsList>
					<TabsContent
						value="products"
						className="sm:py-6 py-4"
					>
						<Products />
					</TabsContent>
					<TabsContent
						value="categories"
						className="sm:py-6 py-4"
					>
						<Categories />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
