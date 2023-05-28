import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Autocomplete.scss";
import { classNameCheck } from "./utils";
import HighlightedTitle from "./HighlightedTitle";

type AutocompleteClassNames = {
  container?: string;
  input?: string;
  dropdown?: string;
  listItem?: string;
  listItemContainer?: string;
};
interface AutocompleteProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (value: string) => void;
  selectedValue: string;
  options: { title: string; key: string }[];
  classNames?: AutocompleteClassNames;
  placeholder?: string;
  isLoading?: boolean;
}

const Autocomplete = ({
  onChange,
  options,
  classNames,
  placeholder,
  onSelect,
  selectedValue,
  isLoading,
}: AutocompleteProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const optionListRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (
      autocompleteRef.current &&
      !autocompleteRef.current?.contains(target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const optionNodeList = useCallback(() => {
    if (optionListRef.current) {
      return options?.map((_, index) =>
        optionListRef.current?.children.item(index)
      );
    }
    return [];
  }, [options]);

  const handleSelected = useCallback(
    (value: string) => {
      onSelect(value);
      setIsFocused(false);
    },
    [onSelect]
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
      setInputValue(e.target.value);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  let currentFocusedItem = -1;

  const handleFocusingListItem = useCallback(
    (direction: "up" | "down") => {
      if (direction === "down") {
        if (currentFocusedItem < optionNodeList()?.length - 1) {
          currentFocusedItem++;
        }
      }

      if (direction === "up") {
        if (currentFocusedItem > 0) {
          currentFocusedItem--;
        }
      }

      optionNodeList().forEach((option) =>
        (option as HTMLElement).classList.remove(
          "autocomplete__listItem--focused"
        )
      );

      optionNodeList()[currentFocusedItem]?.classList.add(
        "autocomplete__listItem--focused"
      );

      optionListRef.current?.scrollTo({
        top: (optionNodeList()[currentFocusedItem] as HTMLElement).offsetTop,
      });
    },
    [optionNodeList, currentFocusedItem]
  );

  const handleKeyboardEvents = useCallback(
    ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
      switch (key) {
        case "Escape":
          setIsFocused(false);
          break;
        case "ArrowDown":
          handleFocusingListItem("down");
          break;
        case "ArrowUp":
          handleFocusingListItem("up");
          break;
        case "Enter":
          handleSelected(options?.[currentFocusedItem]?.title);
          break;
        default:
          setIsFocused(true);
          break;
      }
    },
    [
      setIsFocused,
      handleFocusingListItem,
      handleSelected,
      options,
      currentFocusedItem,
    ]
  );

  const HAS_OPTIONS = options.length > 0;
  const SHOW_RESULT_CONTAINER = isFocused && !isLoading;
  const IS_LOADING = isLoading;

  return (
    <div
      ref={autocompleteRef}
      className={`${classNameCheck(
        classNames?.container
      )} autocomplete autocomplete__container ${classNameCheck(
        isFocused && "autocomplete--focused"
      )}`}
      onFocusCapture={handleFocus}
      onKeyUp={handleKeyboardEvents}
    >
      <input
        type="text"
        onChange={handleOnChange}
        className={`${classNameCheck(
          classNames?.container
        )} autocomplete__input`}
        placeholder={placeholder}
        value={selectedValue}
      />
      <div
        className={`${classNameCheck(
          classNames?.dropdown
        )} autocomplete__dropdown`}
      >
        {IS_LOADING && (
          <div className="autocomplete__loader">
            <div className="autocomplete__loader-inner"></div>
          </div>
        )}
        {SHOW_RESULT_CONTAINER && (
          <ul
            ref={optionListRef}
            className={`${classNameCheck(
              classNames?.listItemContainer
            )} autocomplete__listItemContainer ${classNameCheck(
              !HAS_OPTIONS &&
                IS_LOADING &&
                "autocomplete__listItemContainer--loading"
            )}`}
          >
            {options.map(({ title, key }) => {
              return (
                <li
                  key={key}
                  onClick={() => handleSelected(title)}
                  className={`${classNameCheck(
                    classNames?.listItem
                  )} autocomplete__listItem`}
                >
                  <HighlightedTitle text={title} query={inputValue} />
                </li>
              );
            })}
            {!HAS_OPTIONS && (
              <li className="autocomplete__no-result">Nothing found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
