import { axios } from '@/lib/axios';

import { Check, ChevronsUpDown, LoaderIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ComboboxData {
    data: { option: string | number; value: string | number }[];
    next_page_url: string | null | undefined;
}

interface ComboboxItem {
    [key: string]: string | number;
}

type ComboboxProps = {
    routePath: string;
    getSelectedValue: React.Dispatch<React.SetStateAction<string | number>>;
    title: string;
    comboboxOption: string;
    comboboxValue: string;
    defaultValue ?: {station_title:string|number,station_id:string|number};
    formSubmitted ?: boolean
};

export function Combobox({ getSelectedValue, formSubmitted, title, comboboxOption, comboboxValue, routePath, defaultValue: defaulValue }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [searchValue, setSearchValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<ComboboxData>();        

    const getOptions = React.useCallback(
        (search: string) => {
            setLoading(true);
            axios.get<ComboboxData>(route(routePath, searchValue ? { search: search } : {})).then((response) => {
                response.cached = true;
                setOptions({
                    ...response.data,
                    data: response.data.data.map((item: ComboboxItem) => ({ option: item[comboboxOption], value: item[comboboxValue] })),
                });
                setLoading(false);
            });
        },
        [comboboxOption, comboboxValue, searchValue, routePath],
    );    


    const getMoreOptions = () => {
        if (loading) return;
        if (options?.next_page_url !== null) {
            setLoading(true);
            setTimeout(() => {
                axios.get<ComboboxData>(options?.next_page_url as string).then((response) => {
                    setOptions((prev) => ({
                        data: [
                            ...(prev?.data || []),
                            ...response.data.data.map((item: ComboboxItem) => ({ option: item[comboboxOption], value: item[comboboxValue] })),
                        ],
                        next_page_url: response.data.next_page_url,
                    }));
                    setLoading(false);
                });
            }, 1000);
        }
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight * 0.9) {
            getMoreOptions();
        }
        event.stopPropagation();
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
        const element = event.currentTarget;
        element.scrollTop += event.deltaY;
    };

    React.useEffect(() => {
        setValue('');
        getOptions(searchValue);
    }, [searchValue, getOptions,formSubmitted]);   
    
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full" asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                    {value ? options?.data?.find((option) => option.option === value)?.option : 
                    defaulValue?.station_title ? defaulValue?.station_title:`Select ${title}...`
                    }
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput value={searchValue} onValueChange={setSearchValue} placeholder={`Search ${title} by ${comboboxOption} ...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup onScroll={handleScroll} onWheel={handleWheel} className="max-h-[140px] overflow-y-auto">
                            {options?.data?.map((option, index) => (
                                <CommandItem
                                    key={index}
                                    value={option.option as string}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                        getSelectedValue(option.value.toString());
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value === option.option ? 'opacity-100' : defaulValue?.station_title === option.option && value === '' ? 'opacity-100' : 'opacity-0')} />
                                    {option.option}
                                </CommandItem>
                            ))}
                            {loading && (
                                <CommandItem className="text-muted-foreground flex items-center justify-center">
                                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
