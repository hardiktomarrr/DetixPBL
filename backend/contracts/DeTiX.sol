// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeTiX is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 private _itemsSold;

    uint256 listingPrice = 0.00001 ether;

    struct Ticket {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Ticket) private idToTicket;

    event TicketCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("DeTiX Tickets", "DETIX") Ownable(msg.sender) {}

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public payable onlyOwner {
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createTicket(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        return _createTicket(tokenURI, price);
    }

    function _createTicket(string memory tokenURI, uint256 price) private returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        // require(msg.value == listingPrice, "Price must be equal to listing price"); - Removed: Broken for batch creation

        idToTicket[tokenId] =  Ticket(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit TicketCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    /* batch create tickets for an event */
    function createEventTickets(string memory tokenURI, uint256 price, uint256 supply) public payable {
        require(msg.value == listingPrice * supply, "Price must be equal to listing price * supply");
        for(uint i=0; i<supply; i++){
             _createTicket(tokenURI, price);
        }
    }


    /* resale a ticket */
    function resellTicket(uint256 tokenId, uint256 price) public payable {
        require(idToTicket[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        idToTicket[tokenId].sold = false;
        idToTicket[tokenId].price = price;
        idToTicket[tokenId].seller = payable(msg.sender);
        idToTicket[tokenId].owner = payable(address(this));
        _itemsSold--;

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a ticket item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToTicket[tokenId].price;
        address seller = idToTicket[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        idToTicket[tokenId].owner = payable(msg.sender);
        idToTicket[tokenId].sold = true;
        idToTicket[tokenId].seller = payable(address(0));
        _itemsSold++;
        _transfer(address(this), msg.sender, tokenId);
        payable(owner()).transfer(listingPrice);
        payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (Ticket[] memory) {
        uint itemCount = _tokenIds;
        uint unsoldItemCount = _tokenIds - _itemsSold;
        uint currentIndex = 0;

        Ticket[] memory items = new Ticket[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToTicket[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (Ticket[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Ticket[] memory items = new Ticket[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

     /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (Ticket[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        Ticket[] memory items = new Ticket[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToTicket[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
