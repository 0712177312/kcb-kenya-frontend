package com.compulynx.compas.controllers;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.Channel;
import com.compulynx.compas.models.extras.ChannelRep;
import com.compulynx.compas.services.ChannelService;

@RestController
@RequestMapping(value = Api.REST)
public class ChannelController {
	
	@Autowired
	private ChannelService channelService;
	
	@GetMapping(value = "/gtchannels")
	public ResponseEntity<?> GetChannels() {
		try {
		List<ChannelRep> channels = channelService.getChannels();
		if(channels.size() <= 0) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
					false, "no channels found",
					new HashSet<>(channels)),HttpStatus.OK);
		}
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000",
				true, "channels found",
				new HashSet<>(channels)),HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	
	@GetMapping(value = "/gtChannelstoWaive")
	public ResponseEntity<?> GetChannelsToWaive() {
		try {
		List<Channel> channels = channelService.getChannelsToWaive();
		if(channels.size() <= 0) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
					false, "no channels found",
					new HashSet<>(channels)),HttpStatus.OK);
		}
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000",
				true, "channels found",
				new HashSet<>(channels)),HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	@PostMapping(value = "/upChannel") 
	public ResponseEntity<?> UpChannels(
			@RequestBody Channel channel){
	 try {
		Channel chann = channelService.upChannel(channel);
		
		if(chann == null ) {
			return new ResponseEntity<>(new GlobalResponse("201",
					"channel details were not updated",false,GlobalResponse.APIV),HttpStatus.OK);
		}
	    	return new ResponseEntity<>(new GlobalResponse("000",
				  "channel details updated successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	
	@GetMapping(value = "/gtWaivedchannels")
	public ResponseEntity<?> GetWaivedChannels() {
		try {
		List<Channel> channels = channelService.getWaivedChannles();
		if(channels.size() <= 0) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
					false, "no channels found",
					new HashSet<>(channels)),HttpStatus.OK);
		}
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000",
				true, "channels found",
				new HashSet<>(channels)),HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	
	@PostMapping(value = "/waiveChannel") 
	public ResponseEntity<?> waiveChannel(
			@RequestBody Channel channel){
	 try {
		int chann = channelService.waiveChannel(channel.getWaivedBy(),channel.getId());
		
		if(chann > 0 ) {
	    	return new ResponseEntity<>(new GlobalResponse("000",
				  "channel details updated successfully",true,GlobalResponse.APIV),HttpStatus.OK);
		}

		return new ResponseEntity<>(new GlobalResponse("201",
				"channel details were not updated",false,GlobalResponse.APIV),HttpStatus.OK);

    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	
	@PostMapping(value = "/rejectChannel")
	public ResponseEntity<?> rejectChannel(
			@RequestBody Channel channel) {
	 try {
		int chann = channelService.recectChannel(channel.getWaivedApprovedBy(),channel.getId());
		
		if(chann > 0 ) {
	    	return new ResponseEntity<>(new GlobalResponse("000",
				  "channel details updated successfully",true,GlobalResponse.APIV),HttpStatus.OK);
		}

		return new ResponseEntity<>(new GlobalResponse("201",
				"channel details were not updated",false,GlobalResponse.APIV),HttpStatus.OK);

    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	   }
	}
	
	@PostMapping(value = "/approveChannelWaive") 
	public ResponseEntity<?> approveChannelWaive(
			@RequestBody Channel channel){
	 try {
		int chann = channelService.approveChannelWaive(channel.getWaivedApprovedBy(),channel.getId());
		
		if(chann > 0 ) {
	    	return new ResponseEntity<>(new GlobalResponse("000",
				  "channel details updated successfully",true,GlobalResponse.APIV),HttpStatus.OK);
		}

		return new ResponseEntity<>(new GlobalResponse("201",
				"channel details were not updated",false,GlobalResponse.APIV),HttpStatus.OK);

    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}

}
