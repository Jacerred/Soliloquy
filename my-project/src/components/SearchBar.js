import 'flowbite';
import '../index.css';
import { Dropdown, DropdownItem, TextInput, Button } from "flowbite-react";
import { useState } from 'react';


function SearchBar() {
    const [selected, setSelected] = useState('All text');
    return (
        <>
            <Dropdown label={selected} dismissOnClick={false}>
                <DropdownItem onClick={() => setSelected("Find Day")}>Find Day</DropdownItem>
                <DropdownItem onClick={() => setSelected("Find Time")}>Find Time</DropdownItem>
            </Dropdown>
            <TextInput/>
            <Button>Search</Button>
        </>
    );
}

export default SearchBar;