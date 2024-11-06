import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { useTheme } from "@/hooks/use-theme";

export const Navbar = ({
  page,
  setPage
}: {
  page: string;
  setPage: Function
}) => {

  const location = useLocation();
  const { isOpen: isChangePasswordOpen, onOpen, onOpenChange } = useDisclosure();
  const [changingPassword, setChangingPassword] = useState(false);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("");

  async function changePassword() {
    let method = getUserSignUpMethod()
    if (method != "email") {
      toast("Can't change Password. No Email Id found attached with this account.")
    } else {
      setChangingPassword(true)
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('Error updating password:', error.message);
        toast(`Error updating password: ${error.message}`)

      } else {
        console.log('Password updated successfully');
        toast('Password updated successfully')
      }
    }

    onOpenChange();
    setChangingPassword(false)
    setNewPassword("")
  }

  async function getUserSignUpMethod() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast(`Error fetching user: ${error?.message}`);
      return null;
    }

    const signUpMethod = user.app_metadata.provider;
    console.log('User signed up using:', signUpMethod);
    return signUpMethod;
  }


  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky"
        isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link
              className="flex justify-start items-center gap-1"
              color="foreground"
              href="/"
            >
              <p className="font-bold text-inherit logo text-primary select-none">QuickLink</p>
            </Link>
          </NavbarBrand>

          {/* <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div> */}

        </NavbarContent>

        {/* <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>

      </NavbarContent> */}

        <NavbarContent className="basis-1 pl-4" justify="end">
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>


        <NavbarMenu className="w-3/4 md:w-2/3 lg:w-1/2 ml-auto">
          {/* {searchInput} */}
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => {
              return <NavbarMenuItem key={`${item}-${index}`}>

                {
                  item?.label === "Change password"
                    ?
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        // onOpen()
                        navigate('/reset-email-link')
                      }}
                    >
                      {item.label}
                    </div>
                    :
                    item?.label === "Logout"
                      ?
                      <div
                        className="cursor-pointer text-danger"
                        onClick={async () => {
                          await supabase.auth.signOut()
                          // console.log(theme)
                          theme === "dark" && toggleTheme()
                          // console.log(theme)
                          navigate("/auth")
                        }}
                      >{item?.label}</div>
                      :
                      <Link
                        onPress={() => {
                          setIsOpen(false)
                        }}
                        color={
                          item.href === location.pathname
                            ? "primary"
                            : index === siteConfig.navMenuItems.length - 1
                              ? "danger"
                              : "foreground"
                        }
                        href={`${item.href}`}
                        size="lg"
                      >
                        {item.label}
                      </Link>
                }

              </NavbarMenuItem>
            })}
          </div>
        </NavbarMenu>
      </NextUINavbar >

      <Modal isOpen={isChangePasswordOpen} onOpenChange={() => {
        onOpenChange()
      }}
      >
        <ModalContent>
          <ModalHeader>
            Change Password
          </ModalHeader>
          <ModalBody>
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                console.log(e.target.value)
                setNewPassword(e.target.value)
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="primary" onClick={() => {
              onOpenChange()
            }}>
              Close
            </Button>

            <Button size="sm" className="bg-red-400" onClick={() => changePassword()}>
              {changingPassword ? <Spinner size="sm" color="default" /> : "Change"}
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
};
