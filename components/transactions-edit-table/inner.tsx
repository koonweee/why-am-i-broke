"use client";

import { deleteTransactions } from "@/components/transactions-edit-table/actions";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Transaction } from "@/data/types";
import {
  centsToDollarString,
  cn,
  dateToLegibleString,
  pluralize,
} from "@/lib/utils";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { mutate } from "swr";

interface Props {
  transactions: Transaction[];
}

function groupTransactionsByDay(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach((transaction) => {
    const date = transaction.timestamp_utc;
    // Set date to start of day
    const keyDate = new Date(date);
    keyDate.setHours(0, 0, 0, 0);
    const dateKey = keyDate.toISOString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  return grouped;
}

export function TransactionsEditTableInner(props: Props) {
  const { transactions } = props;

  const groupedTransactions = groupTransactionsByDay(transactions);

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  function getIsTransactionSelected(transaction: Transaction) {
    return selectedTransactions.some((t) => t.uuid === transaction.uuid);
  }

  function handleTransactionClick(transaction: Transaction) {
    // Check if transaction is already selected
    const alreadySelected = getIsTransactionSelected(transaction);
    setSelectedTransactions((prev) => {
      if (alreadySelected) {
        return prev.filter((t) => t.uuid !== transaction.uuid);
      } else {
        return [...prev, transaction];
      }
    });
  }

  const selectedTransactionsString = `${
    selectedTransactions.length
  } ${pluralize("transaction", selectedTransactions.length)}`;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className=" flex flex-col gap-2">
      {Object.entries(groupedTransactions).map(([date, transactions]) => {
        const dateObj = new Date(date);
        return (
          <div key={date} className="flex flex-col">
            <div className="text-md font-semibold text-end border-b py-1">
              {dateToLegibleString(dateObj, false)}
            </div>
            {transactions.map((transaction) => {
              return (
                <button
                  key={transaction.uuid}
                  className={cn(
                    "flex flex-row justify-between border-b p-1 text-sm border-dashed",
                    {
                      "bg-muted": getIsTransactionSelected(transaction),
                    }
                  )}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex flex-col text-start w-[70%]">
                    <div>{transaction.description}</div>
                    <div className="text-muted-foreground">
                      {transaction.category}
                    </div>
                  </div>
                  <div className="flex flex-col text-end">
                    {centsToDollarString(
                      transaction.amount_cents,
                      transaction.is_positive
                    )}
                    <div className="text-muted-foreground">
                      {transaction.timestamp_utc.toLocaleTimeString()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
      {selectedTransactions.length ? (
        <div className="absolute bottom-16 self-center ">
          <div className="flex flex-row items-center gap-4">
            <Toolbar>
              {selectedTransactionsString}
              <div className="flex flex-row items-center gap-2">
                <ToolbarButtonWrapper
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={showDeleteConfirmation}
                >
                  <TrashIcon size={20} className="text-foreground" />
                </ToolbarButtonWrapper>
                <ToolbarButtonWrapper disabled={showDeleteConfirmation}>
                  <PencilIcon size={20} className="text-foreground" />
                </ToolbarButtonWrapper>
              </div>
            </Toolbar>
            <Toolbar className="px-0 py-0 rounded-full">
              <ToolbarButtonWrapper
                onClick={() => {
                  setSelectedTransactions([]);
                  setShowDeleteConfirmation(false);
                }}
              >
                <XIcon size={20} className="text-foreground" />
              </ToolbarButtonWrapper>
            </Toolbar>
          </div>
          {showDeleteConfirmation ? (
            <div className="absolute bottom-12 left-0 right-0 ml-auto mr-auto w-fit pb-1">
              <div className="flex flex-row items-center gap-4">
                <Toolbar className="h-12">{`Delete ${selectedTransactionsString}?`}</Toolbar>
                <Toolbar>
                  <form
                    action={(_formData) => {
                      deleteTransactions(
                        selectedTransactions.map((t) => t.uuid)
                      ).then(() => {
                        mutate(
                          (key: any) => {
                            return (
                              Array.isArray(key) &&
                              key[0] === "/api/transaction/get-for-filters"
                            );
                          },
                          undefined,
                          {
                            revalidate: true,
                          }
                        );
                      });

                      // Clear selected transactions and hide delete confirmation
                      setSelectedTransactions([]);
                      setShowDeleteConfirmation(false);
                    }}
                  >
                    <ToolbarButtonWrapper
                      isLoading={isDeleting}
                      setIsLoading={setIsDeleting}
                    >
                      {isDeleting ? (
                        <LoadingSpinner className="h-5 fill-green-800" />
                      ) : (
                        <CheckIcon size={20} className="text-green-800" />
                      )}
                    </ToolbarButtonWrapper>
                  </form>
                  <ToolbarButtonWrapper
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    <XIcon size={20} className="text-destructive" />
                  </ToolbarButtonWrapper>
                </Toolbar>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButtonWrapper(props: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  formAction?: (formData: FormData) => void;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}): JSX.Element {
  const { onClick, className, disabled, children, setIsLoading, isLoading } =
    props;
  const { pending } = useFormStatus();
  useEffect(() => {
    if (pending !== isLoading && setIsLoading) {
      setIsLoading(pending);
    }
  }, [pending, setIsLoading, isLoading]);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center p-2 rounded-full w-fit hover:bg-accent disabled:hover:bg-inherit disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled}
      type={"submit"}
    >
      {children}
    </button>
  );
}

function Toolbar(props: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const { className } = props;
  return (
    <div
      className={cn(
        "flex flex-row items-center bg-background border px-4 py-1 gap-4 w-fit rounded-xl text-sm",
        className
      )}
    >
      {props.children}
    </div>
  );
}
